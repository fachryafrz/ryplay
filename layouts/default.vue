<script setup>
import packageJson from "@/package.json";

const config = useRuntimeConfig();

useHead({
  titleTemplate: (title) => {
    return title
      ? `${title} - ${config.public.APP_NAME}`
      : config.public.APP_NAME;
  },
  meta: [
    {
      name: `description`,
      content: config.public.APP_DESCRIPTION,
    },
    {
      property: `og:site_name`,
      content: config.public.APP_NAME,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      property: `og:url`,
      content: config.public.APP_URL,
    },
    {
      property: `og:title`,
      content: config.public.APP_NAME,
    },
    {
      property: `og:description`,
      content: config.public.APP_DESCRIPTION,
    },
    {
      property: `og:image`,
      content: `/maskable_icon_x192.png`,
    },
    {
      name: `twitter:title`,
      content: `${config.public.APP_NAME}`,
    },
    { name: `twitter:description`, content: config.public.APP_DESCRIPTION },
    { name: `twitter:image`, content: `/maskable_icon_x192.png` },
    { name: `twitter:card`, content: `summary_large_image` },
    { name: `twitter:creator`, content: `@fachryafrz` },
  ],
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

const { data, error } = await useFetch("/api/token", {
  server: false,
});

if (error.value) {
  console.error("Error fetching token:", error.value);
}
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtPwaManifest />
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
