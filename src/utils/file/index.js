// import Block from './Block'
import Vue from 'vue'
import Crypto from './Crypto'
import Sha1 from './sha1'
import api from '@/api'

let uid = 1
const rExt = /\.([^.]+)$/

function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  UPLOADING: 'uploading',
  CALCULATING: 'calculating',
  FAILED: 'failed',
  DONE: 'done',
  CANCEL: 'cancel'
}

const UPLOADING_STATUS = {
  [STATUS.PREPARING]: 1,
  [STATUS.UPLOADING]: 1,
  [STATUS.CALCULATING]: 1
}

class File {
  constructor ({file, blockSize, chunkSize, uuid, chunkRetry, onStatusChange}) {
    this.file = file
    this.size = file.size || 0
    this.status = 'pending'
    this.batch = guid()
    this.puid = uuid
    this.chunkRetry = chunkRetry
    this.tryCount = 0
    this.blockSize = blockSize
    this.blockCap = Math.ceil(blockSize / chunkSize)
    this.chunkSize = chunkSize
    this.totalBlocks = Math.ceil(this.size / blockSize)
    this.totalChunks = this.blockCap * (this.totalBlocks - 1) + Math.ceil((this.size - (this.totalBlocks - 1) * blockSize) / chunkSize)
    this.sha1 = ''
    this.progress = 0
    this.pos = 0
    this.name = file.name || ('undefined' + uid++)
    this.tokenInfo = null
    this.ctx = {
      length: this.totalChunks
    }
    this.onStatusChange = onStatusChange || function () {}
    var ext = rExt.exec(file.name) ? RegExp.$1.toLowerCase() : ''
    this.lastModified = file.lastModified || (new Date()).getTime()
    if (!ext && file.type) {
      ext = /\/(jpg|jpeg|png|gif|bmp)$/i.exec(file.type) ? RegExp.$1.toLowerCase() : ''
      this.name += '.' + ext
    }
    this.ext = ext
    if (
      !file.type &&
      this.ext &&
      ~'jpg,jpeg,png,gif,bmp'.indexOf(this.ext)
    ) {
      this.type = 'image/' + (this.ext === 'jpg' ? 'jpeg' : this.ext)
    } else {
      this.type = file.type || 'application/octet-stream'
    }
  }

  destroy () {
    this.file = null
    this.size = null
    this.status = null
    this.batch = null
    this.puid = null
    this.chunkRetry = null
    this.tryCount = null
    this.blockSize = null
    this.blockCap = null
    this.chunkSize = null
    this.totalBlocks = null
    this.totalChunks = null
    this.sha1 = null
    this.progress = null
    this.pos = null
    this.name = null
    this.tokenInfo = null
    this.ctx = null
    this.lastModified = null
    this.ext = null
    this.type = null
    this.onStatusChange = null
  }

  getChunkByIndex (pos) {
    // block是个抽象结构，真正结构是chunk,pos代表chunkIndex
    // 所以计算blockIndex应该以位置除以block容量获得
    let blockIndex = Math.floor(pos / this.blockCap)
    // 获取pos在block中的抽象位置
    let posInBlock = pos - blockIndex * this.blockCap
    // 获取block抽象结构的起始结束位置
    let {blockStartByte, blockEndByte} = this.getBlock(blockIndex)
    // 获取chunk在文件中的起始byte
    let startByte = blockStartByte + posInBlock * this.chunkSize
    // 获取chunk在文件中的结束位置
    let endByte = startByte + this.chunkSize
    // 修正结束位置
    if (endByte > blockEndByte) {
      endByte = blockEndByte
    }
    // 获取是否为block中第一块
    let isBlockStart = posInBlock === 0
    // 获取该块是否为文件末尾
    let isFileEnd = endByte === this.size
    // 获取是否为block中最后一块
    let isBlockEnd = posInBlock === this.blockCap - 1 || isFileEnd
    let result = {
      blockIndex,
      posInBlock,
      blockStartByte,
      blockEndByte,
      startByte,
      endByte,
      isBlockStart,
      isBlockEnd,
      isFileEnd,
      size: endByte - startByte,
      blockSize: blockEndByte - blockStartByte,
      offset: posInBlock * this.chunkSize,
      index: Number(pos)
    }
    return result
  }

  getChunk () {
    if (this.pos >= this.totalChunks) {
      return null
    }
    return this.getChunkByIndex(this.pos)
  }

  slice (start, end) {
    const blob = this.file
    const slice = blob.slice || blob.webkitSlice || blob.mozSlice
    return slice.call(blob, start, end)
  }

  getToken () {
    if (this.tokenInfo) {
      return Vue.Promise.resolve(this)
    }
    return new Vue.Promise((resolve, reject) => {
      api.store.token({
        name: this.name,
        parent: this.puid,
        hash: this.sha1
      })
      .then(res => {
        if (res.body.success) {
          this.tokenInfo = res.body.result
          resolve(this)
        } else {
          reject(res)
        }
      })
      .catch(res => {
        reject(res)
      })
    })
  }

  markTry () {
    this.tryCount++
  }

  getBlock (blockIndex, blockSize = this.blockSize) {
    // 获取block抽象结构的起始结束位置
    let blockStartByte = blockIndex * blockSize
    let blockEndByte = blockStartByte + blockSize
    // 修正blockEnd
    if (blockEndByte > this.size) {
      blockEndByte = this.size
    }
    return {
      blockStartByte,
      blockEndByte,
      blockIndex
    }
  }

  loadNext (block) {
    return new Vue.Promise((resolve, reject) => {
      var fr = new FileReader()
      fr.onload = function (e) {
        var sha1 = Sha1.create()
        var hash = sha1.update(e.target.result).digest()
        resolve(hash)
      }
      fr.onloadend = function () {
        fr.onloadend = fr.onload = fr.onerror = null
      }
      fr.onerror = function () {
        reject()
      }
      fr.readAsArrayBuffer(this.slice(block.blockStartByte, block.blockEndByte))
    })
  }

  getHash () {
    if (this.sha1) {
      return Vue.Promise.resolve(this)
    }
    let tasks = []
    for (let i = 0; i < this.totalBlocks; i++) {
      tasks.push(this.loadNext(this.getBlock(i)))
    }
    return Vue.Promise.all(tasks)
      .then(hashs => {
        var perfex = Math.log2(this.blockSize)
        var isSmallFile = hashs.length === 1
        let sha1str = ''
        let hash = null
        if (isSmallFile) {
          hash = hashs[0]
        } else {
          perfex = 0x80 | perfex
          hash = hashs.reduce((a, b) => a.concat(b))
          let sha1 = Sha1.create()
          hash = sha1.update(hash).digest()
        }
        hash.unshift(perfex)
        sha1str = Crypto.Crypto.util.bytesToBase64(hash).replace(/\//g, '_').replace(/\+/g, '-')
        this.sha1 = sha1str
        return this
      })
  }

  setPos (pos) {
    this.pos = pos
  }

  setStatus (status) {
    this.status = status
    if (status === File.STATUS.PENDING) {
      this.tryCount = 0
    }
    if (status === File.STATUS.DONE) {
      this.progress = 100
    }
    this.onStatusChange(this, this.status)
  }

  setProgress (byte) {
    this.progress = ((this.pos * this.chunkSize + byte) / this.size) * 100
  }

  isUploading () {
    return this.status in File.UPLOADING_STATUS
  }

  isDone () {
    return this.status === File.STATUS.DONE
  }

  isPending () {
    return this.status === File.STATUS.PENDING
  }

  isTryout () {
    return this.tryCount > this.chunkRetry
  }

  isCancel () {
    return this.status === File.STATUS.CANCEL
  }

  resetTryout () {
    this.tryCount = 0
    this.status = File.STATUS.PENDING
  }

  resetState () {
    this.tryCount = 0
    this.status = File.STATUS.PENDING
    this.pos = 0
    this.batch = guid()
    this.progress = 0
  }

  isExisted () {
    if (this.tokenInfo) {
      if (this.tokenInfo.uuid) {
        return true
      }
    }
    return false
  }

  setFileInfo (fileInfo) {
    this.tokenInfo = fileInfo
  }

  getFileInfo () {
    if (this.isExisted()) {
      return this.tokenInfo
    }
    return null
  }

  getServerInfo () {
    const chunk = this.getChunk()
    let url = this.tokenInfo.uploadUrl
    if (chunk.isBlockStart) {
      url += `/mkblk/${chunk.blockSize}/${chunk.blockIndex}`
    } else {
      url += `/bput/${this.ctx[chunk.index - 1]}/${chunk.offset}`
    }
    return {
      url,
      Authorization: this.tokenInfo.token,
      UploadBatch: this.batch,
      chunk
    }
  }

  getCreatFileServerInfo () {
    const chunk = this.getChunk()
    let url = this.tokenInfo.uploadUrl
    url += `/mkfile/${this.size}`
    return {
      url,
      Authorization: this.tokenInfo.token,
      UploadBatch: this.batch,
      chunk,
      ctxList: Array.from(this.ctx).filter((ctx, index) => {
        return this.getChunkByIndex(index).isBlockEnd
      }).toString()
    }
  }

  setCtx (ctx, chunk) {
    if (!chunk) {
      chunk = this.getChunk()
    }
    this.ctx[chunk.index] = ctx
  }
}

File.STATUS = STATUS
File.UPLOADING_STATUS = UPLOADING_STATUS

export default File
