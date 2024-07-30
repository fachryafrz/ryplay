// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: [
    "nuxt-swiper",
    "dayjs-nuxt",
    "@nuxtjs/mdc",
    "@nuxt/icon",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
  ],
  pwa: {
    manifest: {
      name: process.env.APP_NAME,
      short_name: process.env.APP_NAME,
      description: process.env.APP_DESCRIPTION,
      icons: [
        {
          src: "maskable_icon_x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "screenshots/home.png",
          sizes: "640x320",
          type: "image/png",
          form_factor: "wide",
          label: "Home Screen",
        },
        {
          src: "screenshots/game_details.png",
          sizes: "640x320",
          type: "image/png",
          form_factor: "wide",
          label: "Game Details",
        },
      ],
      start_url: "./",
      scope: "./",
      display: "standalone",
      background_color: "#0b0c0d",
      theme_color: "#0b0c0d",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    public: {
      APP_NAME: process.env.APP_NAME,
      APP_NAME_SPACED: process.env.APP_NAME_SPACED,
      APP_URL: process.env.APP_URL,
      APP_DESCRIPTION: process.env.APP_DESCRIPTION,
    },
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com ",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0",
        },
      ],
    },
  },
});
