<script setup>
const config = useRuntimeConfig();

useHead({
  titleTemplate: (title) => {
    return title
      ? `${title} at ${config.public.APP_NAME}`
      : config.public.APP_NAME;
  },
});

onMounted(async () => {
  const response = await $fetch("/api/token");
});
</script>

<template>
  <div class="flex">
    <NuxtLoadingIndicator />

    <aside class="sticky top-0 h-screen border-r-2 border-secondary z-[99999]">
      <Sidebar />
    </aside>

    <main class="flex w-full flex-col gap-8 p-4 lg:max-w-[calc(100%-305px)]">
      <NuxtPage />
    </main>
  </div>
</template>
