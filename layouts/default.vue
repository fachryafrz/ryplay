<script setup>
import { IGDB_ACCESS_TOKEN } from "~/server/utils/constants";

const config = useRuntimeConfig();

const token = useCookie(IGDB_ACCESS_TOKEN);
watch(token, () => {
  if (!token.value) location.reload();
});

const mustLogin = useShowMustLogin();

useHead({
  titleTemplate: (title) => {
    return title
      ? `${title} - ${config.public.APP_NAME}`
      : config.public.APP_NAME;
  },
  link: [
    {
      rel: `icon`,
      type: `image/x-icon`,
      href: `/favicon.ico`,
    },
    {
      rel: `manifest`,
      href: `/manifest.webmanifest`,
    },
  ],
  script: [
    {
      async: true,
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.public.ADSENSE_CLIENT_ID}`,
      crossorigin: `anonymous`,
    },
  ],
});

useSeoMeta({
  description: config.public.APP_DESCRIPTION,
  ogSiteName: config.public.APP_NAME,
  ogType: `website`,
  ogUrl: config.public.APP_URL,
  ogTitle: config.public.APP_NAME,
  ogDescription: config.public.APP_DESCRIPTION,
  ogImage: `${config.public.APP_URL}/maskable_icon_x192.png`,
  twitterTitle: config.public.APP_NAME,
  twitterDescription: config.public.APP_DESCRIPTION,
  twitterImage: `${config.public.APP_URL}/maskable_icon_x192.png`,
  twitterCard: `summary_large_image`,
  twitterCreator: `@fachryafrz`,
  robots: {
    noindex: true,
    nofollow: true,
    noimageindex: true,
  },
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <!-- <Sidebar> -->
    <div class="flex flex-col gap-0">
      <Header />

      <main class="px-4">
        <NuxtPage />
      </main>

      <Footer />
    </div>
    <!-- </Sidebar> -->

    <div v-if="mustLogin" class="toast z-50">
      <div class="alert alert-error">
        <Icon name="ion:locked" size="20" />
        <span>{{ mustLogin }}</span>
      </div>
    </div>
  </div>
</template>
