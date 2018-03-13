<template>
  <div class="icon" :data-type="type"></div>
</template>

<script>
export default {
  name: 'FileIcon',
  props: ['type']
}
</script>

<style scoped>
.icon {
    width: 30px;
    height: 32px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: left bottom;
}

[data-type="pack"] {
  background-image: url(../../assets/fileicon/pack.png);
}

[data-type="documents"] {
  background-image: url(../../assets/fileicon/documents.png);
}

[data-type="floder"] {
  background-image: url(../../assets/fileicon/floder.png);
}

[data-type="music"] {
  background-image: url(../../assets/fileicon/music.png);
}

[data-type="other"] {
  background-image: url(../../assets/fileicon/other.png);
}

[data-type="video"] {
  background-image: url(../../assets/fileicon/video.png);
}

[data-type="image"] {
  background-image: url(../../assets/fileicon/image.png);
}
</style>
