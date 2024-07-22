<script setup>
const config = useRuntimeConfig();

useHead({
  titleTemplate: (title) => {
    return title
      ? `${title} at ${config.public.APP_NAME}`
      : config.public.APP_NAME;
  },
});
</script>

<template>
  <div class="flex">
    <aside class="sticky top-0 h-screen border-r-2 border-secondary">
      <Sidebar />
    </aside>

    <main class="flex min-h-[300svh] w-full flex-col gap-8 p-4">
      <Header />

      <NuxtPage />
    </main>
  </div>
</template>
