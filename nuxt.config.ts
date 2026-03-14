// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: false },
  modules: [
    "nuxt-swiper",
    "dayjs-nuxt",
    "@nuxtjs/mdc",
    "@nuxt/icon",
    "@vueuse/nuxt",
    "@nuxtjs/sitemap",
    "nuxt-gtag",
    "nuxt-toast",
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
    HEALTH_SECRET: process.env.HEALTH_SECRET,
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
  vite: {
    optimizeDeps: {
      include: ["debug"],
    },
  },
  routeRules: {
    // API
    "/api/home": {
      swr: 3600,
      headers: {
        "cache-control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
    "/api/games/home-sections/**": {
      swr: 3600,
      headers: {
        "cache-control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
    "/api/games/details/**": {
      swr: 3600,
      headers: {
        "cache-control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },

    // Pages
    "/games/**": {
      swr: 3600,
      headers: {
        "cache-control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
    "/": {
      swr: 3600,
      headers: {
        "cache-control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  },
});
