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
    "@nuxtjs/sitemap",
    "nuxt-gtag",
    "@nuxtjs/supabase",
  ],
  gtag: {
    id: process.env.GA_MEASUREMENT_ID,
  },
  site: {
    trailingSlash: false,
  },
  // sitemap: {
  //   sources: ["/api/sitemap"],
  // },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    API_URL: process.env.API_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    public: {
      APP_NAME: process.env.APP_NAME,
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
  routeRules: {
    "/search": { ssr: false },
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/login",
    },
  },
});
