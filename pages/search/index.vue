<script setup>
const route = useRoute();
const loadMoreRef = ref();
const games = ref([]);
const offset = ref(0);

const fetchGames = async () => {
  // NOTE: Pake $fetch kalau tidak perlu Server Side
  const response = await $fetch("/api/games/search", {
    method: "POST",
    params: route.query,
    body: {
      offset: offset.value,
    },
  });

  if (response) games.value.push(...response);
};

try {
  await fetchGames();

  useHead({
    title: "Search",
    meta: [
      {
        name: "description",
        content: "Search for your favorite games",
      },
    ],
  });
} catch (error) {
  console.error("Failed to fetch games:", error);
}

watch(
  () => route.fullPath,
  async () => {
    offset.value = 0;
    games.value = [];
    await fetchGames();
  },
  { immediate: true },
);

useInfiniteScroll(loadMoreRef, async () => {
  offset.value += 10;
  await fetchGames();
});
</script>

<template>
  <div>
    <h1 class="sr-only">Search</h1>

    <SearchBar
      class="mb-4 mt-2"
      :class="{
        'sm:hidden': route.path === '/search',
      }"
    />

    <div v-show="games.length < 1" class="flex justify-center">
      <span class="loading loading-spinner"></span>
    </div>

    <GameGrid v-show="games.length > 0" :games="games" />

    <button
      ref="loadMoreRef"
      v-show="games.length >= 20 && games.length >= offset"
      class="pointer-events-none mx-auto mt-4 flex aspect-square"
    >
      <span class="loading loading-spinner"></span>
    </button>
  </div>
</template>
