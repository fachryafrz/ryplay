<script setup>


const appConfig = useAppConfig();

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
      rel: `icon`,
      type: `image/x-icon`,
      media: `(prefers-color-scheme: light)`,
      href: `/favicon/light/favicon.ico`,
    },
    {
      rel: `icon`,
      type: `image/x-icon`,
      media: `(prefers-color-scheme: dark)`,
      href: `/favicon/dark/favicon.ico`,
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
  <div class="flex flex-col gap-0">
    <Header />

    <main class="px-4">
      <NuxtPage />
    </main>

    <Footer />
  </div>
</template>
