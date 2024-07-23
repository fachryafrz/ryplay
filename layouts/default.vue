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

    <aside class="sticky top-0 z-[99999] h-[100dvh] border-r-2 border-secondary">
      <Sidebar />
    </aside>

    <main
      class="flex w-full flex-col gap-4 p-4 lg:max-w-[calc(100%-305px)] lg:gap-8"
    >
      <NuxtPage />
    </main>
  </div>
</template>
