// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: '个人作品集',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'referrer', content: 'never' }
      ]
    },
    baseURL: '/mrwz-wang/',
    buildAssetsDir: 'assets'
  },

  compatibilityDate: '2025-03-14',

  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/components/icons', prefix: '' }
  ],
  
  // 配置静态资源
  nitro: {
    routeRules: {
      '/content/**': { 
        headers: { 
          'cache-control': 'public, max-age=31536000' 
        }
      }
    }
  },
  
  // 生成静态网站
  ssr: false,
  
  // 开发模式配置
  experimental: {
    payloadExtraction: false
  },
  
  // 添加公共目录配置
  public: {
    baseURL: '/',
  },
  
  // 添加内容目录作为静态资源
  hooks: {
    'nitro:config': (nitroConfig) => {
      // 添加content目录到静态资源
      if (!nitroConfig.publicAssets) nitroConfig.publicAssets = [];
      nitroConfig.publicAssets.push({
        dir: 'content',
        baseURL: '/content',
        maxAge: 60 * 60 * 24 * 365 // 1年缓存
      });
    }
  }
})