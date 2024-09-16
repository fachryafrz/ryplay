<script setup>
const config = useRuntimeConfig();

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
  </div>
</template>
