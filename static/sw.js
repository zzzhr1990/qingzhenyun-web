importScripts('/_nuxt/workbox.3de3418b.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "qz2",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.fff89efaddb6015add4d.js",
    "revision": "cad8e624cab8bb362c54f2de03db66ef"
  },
  {
    "url": "/_nuxt/1.97f56cbb780698bffe16.js",
    "revision": "67263614ecd5194c10ee4a522bc95bbf"
  },
  {
    "url": "/_nuxt/16.3470feaa1abca8689b0d.js",
    "revision": "94926012b594290320609114d454be84"
  },
  {
    "url": "/_nuxt/17.fb0e343beb15787cc127.js",
    "revision": "b1e82979f17a2f6fc817e40bccc51f54"
  },
  {
    "url": "/_nuxt/19.6d682d70bb74f58d824c.js",
    "revision": "0272ce03ebaae7c8b0e957c8bf3afcf2"
  },
  {
    "url": "/_nuxt/20.32d7931102c246959c9d.js",
    "revision": "fe9154f4595741399cbfce5fd1e93509"
  },
  {
    "url": "/_nuxt/layouts/default.bba4d7812f3437013839.js",
    "revision": "e18a2b9d6c43bd957b107e5c63bef815"
  },
  {
    "url": "/_nuxt/layouts/index.afcb29e9258ff3b51db4.js",
    "revision": "16e359b193c6316b898ffb17811462fe"
  },
  {
    "url": "/_nuxt/layouts/toolbarback.59aca0347937dca8550f.js",
    "revision": "254912ffb4152e240cf6cc5117eb479e"
  },
  {
    "url": "/_nuxt/manifest.c3e23c6cf872d68f1e7a.js",
    "revision": "ba2ec76f49f5c1765f765b73f3db7086"
  },
  {
    "url": "/_nuxt/pages/changepswwithmsg.1269ac57473f6b3d89cc.js",
    "revision": "c36a02348b1e2aaed18f7e441403cc71"
  },
  {
    "url": "/_nuxt/pages/changewitholdpassword.dda17207b9006f8aec6b.js",
    "revision": "d42d932b3460a62b2e5a989c21bf7a44"
  },
  {
    "url": "/_nuxt/pages/changpassword.166f946302a52a9ae668.js",
    "revision": "63f73c06bba5bfef8e2d620986fcee1c"
  },
  {
    "url": "/_nuxt/pages/home/_path.7663dccfe09c28ca2026.js",
    "revision": "6fa96b3250f9cf5cf7a5966821ef4221"
  },
  {
    "url": "/_nuxt/pages/index.f2661bfddca81203cfe5.js",
    "revision": "ad895d81ab437d0268b1368f78a38a0f"
  },
  {
    "url": "/_nuxt/pages/index2.41fb56c8ddf60b62da30.js",
    "revision": "84adfc116fc36882b0f9ec765975a41a"
  },
  {
    "url": "/_nuxt/pages/inspire.a4cbef76f876154d8d96.js",
    "revision": "9db6311ede270b09660ee5a09049195a"
  },
  {
    "url": "/_nuxt/pages/login.9b69c0880e2ae2783436.js",
    "revision": "bbd08e547738e45634cd332934a0f196"
  },
  {
    "url": "/_nuxt/pages/loginwithmsg.9ce58ab2b2576d01fe03.js",
    "revision": "b083124bcebc067c4f38663029761dce"
  },
  {
    "url": "/_nuxt/pages/loginwithphone.f3ceafde27b82c24b55c.js",
    "revision": "faad95f1c982ebc1982f37248aa8e306"
  },
  {
    "url": "/_nuxt/pages/regist.a69011a6432b177eb00a.js",
    "revision": "906a05b40d839b00fc3886d96c077f2b"
  },
  {
    "url": "/_nuxt/vendor.05b69646a844b3752fd9.js",
    "revision": "a4c3310cd5b07acb80c9ac62c6d0c7b0"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

