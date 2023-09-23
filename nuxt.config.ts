// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@element-plus/nuxt',
  ],
  elementPlus: {
    themes: ['dark'],
  },
  app: {
    head: {
      title: 'Albion NDA Viewer',
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: 'Simple web app that uses scraped data from Albion Online Forum to display easily readable NDA changes.' },
      ],
    },
  },
});
