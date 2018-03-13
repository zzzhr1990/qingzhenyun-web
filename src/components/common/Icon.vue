<template>
    <span :data-type="type" class="icon"></span>
</template>

<script>
export default {
  name: 'Icon',
  props: ['type']
}
</script>

<style scoped>
@font-face {
  font-family: 'icomoon';
  src:  url('../../assets/font/icomoon.eot?djs5w');
  src:  url('../../assets/font/icomoon.eot?djs5w#iefix') format('embedded-opentype'),
    url('../../assets/font/icomoon.ttf?djs5w') format('truetype'),
    url('../../assets/font/icomoon.woff?djs5w') format('woff');
  font-weight: normal;
  font-style: normal;
}

.icon {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[data-type="user"]:before {
  content: "\e900";
}
[data-type="download"]:before {
  content: "\e901";
}
[data-type="dropdown"]:before {
  content: "\e902";
}
[data-type="dropdown1"]:before {
  content: "\e903";
}
[data-type="email"]:before {
  content: "\e904";
}
[data-type="folderadd"]:before {
  content: "\e905";
}
[data-type="phone"]:before {
  content: "\e906";
}
[data-type="password"]:before {
  content: "\e907";
}
[data-type="upload"]:before {
  content: "\e908";
}
[data-type="phone1"]:before {
  content: "\e909";
}

</style>
