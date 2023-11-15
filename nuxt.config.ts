// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
    './src/module',
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
  ssr: false,
});
