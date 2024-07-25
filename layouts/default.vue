<script setup>
const config = useRuntimeConfig();

useHead({
  titleTemplate: (title) => {
    return title
      ? `${title} at ${config.public.APP_NAME}`
      : config.public.APP_NAME;
  },
});

await $fetch("/api/token");
</script>

<template>
  <div class="flex">
    <NuxtLoadingIndicator />

    <aside
      class="sticky top-4 z-[99999] h-[100dvh] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-r-2xl outline outline-secondary"
    >
      <Sidebar />
    </aside>

    <main class="flex w-full flex-col gap-4 p-4 xl:max-w-[calc(100%-300px)]">
      <Header />

      <NuxtPage />
    </main>
  </div>
</template>
