// const colors = require('vuetify/es5/util/colors').default
const path = require('path')

module.exports = {
  srcDir: 'src',
  buildDir: 'functions/.nuxt',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + 'The Coding Insight',
    title: 'The Coding Insight',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#2979ff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/combined-inject.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: false,
    theme: {
      themes: {
        // light: {
        //   primary: '#2979ff',
        //   secondary: '#212121',
        //   error: '#FF5252',
        //   info: '#767676',
        //   success: '#4CAF50',
        //   warning: '#FFC107'
        // },
        dark: {
          primary: '#2979ff',
          secondary: '#212121',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#767676',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      },

      options: {
        customProperties: true,
        variations: false
      },

      dark: true
    },
    icons: {
      iconfont: 'md'
    },
    rtl: false
  },
  /*
  ** Build configuration
  */
  build: {
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    /*
    ** You can extend webpack config here
    */
    /**
    * Uncomment to analyze bundle sizes of modules
    */
    // analyze: true,
    /**
     * Uncomment below statement Extract css into a single file
     */
    // extractCSS: true,
    extend (config, { isClient, isServer }) {
      config.resolve.alias.vue$ = path.resolve(__dirname, './node_modules/vue/dist/vue.esm.js')
    }
  }
}
