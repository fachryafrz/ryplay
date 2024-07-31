<script setup>
const route = useRoute();
const loadMoreRef = ref();
const games = ref([]);
const offset = ref(0);

// Fungsi untuk mengambil data berdasarkan query params
const fetchGames = async () => {
  const { query, rating, genre, platform, release_date, category, company } =
    route.query;

  const { data: response, error } = await useFetch("/api/games/search", {
    method: "POST",
    params: route.query,
    body: {
      offset: offset.value,
    },
  });

  if (error.value) throw error.value;
  if (response.value) {
    // NOTE: Ada bug kalo cari "star wars" infinite scroll nya jalan terus
    const uniqueGames = response.value.filter((game) =>
      games.value.every((g) => g.id !== game.id),
    );

    games.value.push(...response.value);
  }
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

// Memanggil fetchGames setiap kali route.query berubah
watch(
  () => route.fullPath,
  async () => {
    offset.value = 0;
    games.value = [];
    await fetchGames();
  },
  { immediate: true },
);

const loadMore = async () => {
  offset.value += 20;
  await fetchGames();
};

useInfiniteScroll(loadMoreRef, async () => {
  await loadMore();
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

    <GameGrid v-if="games" :games="games" />

    <button
      @click="loadMore"
      ref="loadMoreRef"
      v-if="games.length >= 20 && games.length >= offset"
      class="pointer-events-none mx-auto mt-4 flex aspect-square"
    >
      <span class="loading loading-spinner"></span>
    </button>
  </div>
</template>
