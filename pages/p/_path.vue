<template>
  <div>
    <iframe width="100%" height="500" scrolling="no"
    :src="src"></iframe>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import pdf from 'vue-pdf'
// import 'vue-pdf/src/annotationLayer.css'
import Message from 'vuetify-toast'

export default {
  middleware: 'auth',
  layout: 'v',
  data () {
    return {
      result: null
    }
  },
  computed: {
    ...mapState('preview', [
      'previewMsg',
      'previewPdf'
    ]),
    src () {
      return `${process.env.baseURL}/pdfviewer/web/viewer.html?file=` + encodeURIComponent(this.previewPdf.url)
      // return `${process.env.baseURL}/simpleviewer20489/index.html?file=` + encodeURIComponent(this.previewPdf.url)
    }
  },
  watch: {
    message (msg) {
      Message[msg.type](msg.message)
    }
  },
  created () {
    let type = this.$route.query.type
    let path = this.$route.params.path
    if (type === 'pdf') {
      this.pdf({
        path: path
      })
    }
  },
  methods: {
    ...mapActions('preview', [
      'pdf'
    ])
  }
}
</script>
