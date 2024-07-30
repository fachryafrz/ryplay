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
      name: "description",
      content: config.public.APP_DESCRIPTION,
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
     {
      rel: "manifest",
      href: "/manifest.webmanifest",
     }
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
    <Sidebar>
      <div class="flex flex-col gap-4">
        <Header />
  
        <main>
          <NuxtPage />
        </main>
  
        <Footer />
      </div>
    </Sidebar>
  </div>
</template>
