/* eslint-disable */
var Crypto = {
  Crypto: {}
};
(function(self){
  var e=self.Crypto,
  g=e.util={
    rotl:function(a,b){return a<<b|a>>>32-b},
    rotr:function(a,b){return a<<32-b|a>>>b},
    endian:function(a){
      if(a.constructor==Number)
        return 
      g.rotl(a,8)&16711935|g.rotl(a,24)&4278255360;
      for(var b=0;b<a.length;b++)
        a[b]=g.endian(a[b]);
      return a
    },
    randomBytes:function(a){
      for(var b=[];a>0;a--)
        b.push(Math.floor(Math.random()*256));
      return b
    },
    bytesToWords:function(a){
      for(var b=[],c=0,d=0;c<a.length;c++,d+=8)
        b[d>>>5]|=a[c]<<24-d%32;
      return b
    },
    wordsToBytes:function(a){
      for(var b=[],c=0;c<a.length*32;c+=8)
        b.push(a[c>>>5]>>>24-c%32&255);
      return b
    },
    bytesToHex:function(a){
      for(var b=[],c=0;c<a.length;c++)
        b.push((a[c]>>>4).toString(16)),b.push((a[c]&15).toString(16));
      return b.join("")
    },
    hexToBytes:function(a){
      for(var b=[],c=0;c<a.length;c+=2)
        b.push(parseInt(a.substr(c,2),16));
      return b
    },
    bytesToBase64:function(a){
      return btoa(f.bytesToString(a));
    },
    base64ToBytes:function(a){
      return f.stringToBytes(atob(a));
    }
  },
  e=e.charenc={};
  e.UTF8={
    stringToBytes:function(a){
      return f.stringToBytes(unescape(encodeURIComponent(a)))
    },
    bytesToString:function(a){
      return decodeURIComponent(escape(f.bytesToString(a)))
    }
  };
  var f=e.Binary={
    stringToBytes:function(a){
      for(var b=[],c=0;c<a.length;c++)
        b.push(a.charCodeAt(c)&255);
      return b
    },
    bytesToString:function(a){
      for(var b=[],c=0;c<a.length;c++)
        b.push(String.fromCharCode(a[c]));
      return b.join("")
    }
  }
})(Crypto);

export default Crypto;
/* eslint-enable */
