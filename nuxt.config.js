// const pkg = require('./package')

// const path = require('path')

const nodeExternals = require('webpack-node-externals')

// const extendConfig = require('./api.config.js')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '6pan',
    titleTemplate: '%s | 6pan.cn',
    htmlAttrs: {
      xmlns: 'http://www.w3.org/1999/xhtml',
      lang: 'zh'
    },
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'cleartype', content: 'on' },
      { name: 'author', content: '6pan.cn' },
      { name: 'MobileOptimized', content: '320' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'green' },
      { name: 'apple-mobile-web-app-title', content: '6pan.cn' },
      { name: 'apple-touch-icon', content: '/static/icon.png' },
      { name: 'msapplication-TileImage', content: '/static/icon.png' },
      { name: 'msapplication-TileColor', content: 'green' },
      { name: 'format-detection', content: 'telephone=no,email=no' },
      { name: 'copyright', content: 'Copyright ©6pan.cn 版权所有' },
      { hid: 'keywords', name: 'keywords', content: '仓鼠云,6PAN.COM,云盘,云存储,云端备份,私人存储' },
      { hid: 'description', name: 'description', content: '仓鼠云6PAN.COM-专业的私人云盘,在线存储,云端备份,为您提供安全、便捷、愉悦的云存储体验' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'author', type: 'text/plain', href: '/humans.txt' }
    ],
    noscript: [
      { innerHTML: '本网站需要javascript支持，请开启' }
    ]
  },

  manifest: {
    // start_url: '.',
    name: '6pan.cn',
    short_name: '6pan',
    theme_color: 'green',
    display: 'standalone',
    background_color: '#fff',
    description: '仓鼠云6PAN.COM-专业的私人云盘,在线存储,云端备份,为您提供安全、便捷、愉悦的云存储体验',
    lang: 'zh'
  },

  cache: {
    max: 100,
    maxAge: 1000 * 60 * 15
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Global CSS
  */
  css: [
    'material-design-icons/iconfont/material-icons.css',
    'chimee-player/lib/chimee-player.browser.css',
    'vuetify/src/stylus/main.styl',
    '@/assets/css/vuetify-fixed.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/services',
    '@/plugins/prompt',
    '@/plugins/axios',
    { src: '@/plugins/chimee-player', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa'
  ],

  /*
  ** Build configuration
  */
  build: {
    // publicPath: extendConfig.cdnUrl,
    /*
    ** You can extend webpack config here
    */
    extend (config, { isDev, isClient, isServer }) {
      // if (!isDev) {
      //   const vueLoader = webpackConfig.module.rules.find(loader => loader.loader === 'vue-loader')
      //   if (vueLoader) {
      //     // 处理 Template 中的 cdn 地址
      //     vueLoader.options.loaders.html = path.resolve(__dirname, './extend/html-cdn-loader')
      //     // 处理 CSS 中的 cdn 地址
      //     const vueLoaders = vueLoader.options.loaders
      //     for (cssLoader in vueLoaders) {
      //       if (Array.isArray(vueLoaders[cssLoader])) {
      //         vueLoaders[cssLoader].forEach(loader => {
      //           if (loader.loader === 'css-loader') {
      //             loader.options.root = extendConfig.cdnUrl
      //           }
      //         })
      //       }
      //     }
      //   }
      // }
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    },
    vendor: [
      'axios',
      'universal-cookie',
      'chimee-player',
      '@/assets/countryCode.json'
    ],
    maxChunkSize: 350000,
    babel: {
      presets: [
        [
          'env', {
            // modules: false,
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
            }
          }
        ],
        ['stage-2']
      ],
      plugins: ['transform-runtime']
    }
  },
  env: {
    baseURL: 'https://6pan.cn',
    HOST: '127.0.0.1',
    PORT: 3000
  }
}
