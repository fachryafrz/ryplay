<script setup>
const config = useRuntimeConfig();
const showFilter = useShowFilter();

useSeoMeta({
  title: `Search`,
  description: `Search for your favorite games`,
  ogTitle: `Search - ${config.public.APP_NAME}`,
  ogDescription: `Search for your favorite games`,
  twitterTitle: `Search - ${config.public.APP_NAME}`,
  twitterDescription: `Search for your favorite games`,
});

const { data: multiquery } = await useFetch("/api/search/multiquery", {
  transform: (payload) => {
    return {
      results: payload,
      fetchedAt: new Date(),
    };
  },
  getCachedData: (key, nuxtApp) => {
    const data = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
    if (!data) return;

    const expiration = new Date(data.fetchedAt);
    expiration.setTime(expiration.getTime() + 30 * 60 * 1000);

    const isExpired = expiration.getTime() < Date.now();

    if (isExpired) return;

    return data;
  },
});
</script>

<template>
  <div class="-mx-4 flex">
    <h1 class="sr-only">Search</h1>

    <!-- Filters -->
    <div
      class="fixed inset-0 top-[72px] z-[100] mt-1 h-screen max-h-[calc(100dvh-72px)] transition-all duration-300 lg:sticky lg:h-auto lg:max-h-none lg:min-w-[315px] lg:max-w-[315px] lg:pl-4"
      :class="{
        '-translate-x-[calc(100%+1rem)]': !showFilter,
        'translate-x-0': showFilter,
      }"
    >
      <SearchFilter :multiquery="multiquery.results" />

      <button @click="setShowFilter" class="absolute right-4 top-2 lg:hidden">
        <Icon name="ion:close" size="28" />
      </button>
    </div>

    <!-- Top -->
    <ClientOnly>
      <Search :multiquery="multiquery" />
    </ClientOnly>
  </div>
</template>
