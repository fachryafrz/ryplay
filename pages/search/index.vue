<script setup>
const route = useRoute();
const games = ref();

// Fungsi untuk mengambil data berdasarkan query params
const fetchGames = async () => {
  const { query, rating, genre, platform, release_date, category, company } =
    route.query;

  const { data: response, error } = await useFetch("/api/games/search", {
    params: {
      query,
      rating,
      genre,
      platform,
      release_date,
      category,
      company,
    },
  });

  if (error.value) throw error.value;
  if (response.value) games.value = response.value;
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
watch(() => route.fullPath, fetchGames, { deep: true });
</script>

<template>
  <div>
    <h1 class="sr-only">Search</h1>

    <GameGrid v-if="games" :games="games" />
  </div>
</template>
