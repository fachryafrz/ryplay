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
  <div class="flex">
    <NuxtLoadingIndicator />

    <aside
      class="sticky top-4 z-[99999] h-[100dvh] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-r-xl outline outline-secondary"
    >
      <Sidebar />
    </aside>

    <div
      class="flex min-h-screen w-full flex-col gap-4 p-4 xl:max-w-[calc(100%-300px)]"
    >
      <main class="flex flex-col gap-4">
        <Header />

        <NuxtPage />
      </main>

      <Footer />
    </div>
  </div>
</template>
