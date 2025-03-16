<script setup>
import { IGDB_ACCESS_TOKEN } from "~/server/utils/constants";

const appConfig = useAppConfig();

const token = useCookie(IGDB_ACCESS_TOKEN);
watch(token, () => {
  if (!token.value) location.reload();
});

const mustLogin = useShowMustLogin();

useHead({
  titleTemplate: (title) => {
    return title ? `${title} - ${appConfig.name}` : appConfig.name;
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
});

useSeoMeta({
  description: appConfig.description,
  ogSiteName: appConfig.name,
  ogType: `website`,
  ogUrl: appConfig.url,
  ogTitle: appConfig.name,
  ogDescription: appConfig.description,
  ogImage: `${appConfig.url}/maskable/maskable_icon_x512.png`,
  twitterTitle: appConfig.name,
  twitterDescription: appConfig.description,
  twitterImage: `${appConfig.url}/maskable/maskable_icon_x512.png`,
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
  <NuxtLoadingIndicator color="#98ee2f" :height="2" />
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
</template>
