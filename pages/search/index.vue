<script setup>
const route = useRoute();
const games = ref([]);

// Fungsi untuk mengambil data berdasarkan query params
const fetchGames = async () => {
  const { query, rating, genre, platform, release_date, category } =
    route.query;

  try {
    const { data: response, error } = await useFetch("/api/games/search", {
      params: {
        query,
        rating,
        genre,
        platform,
        release_date,
        category,
      },
    });

    if (error.value) {
      throw error.value;
    }

    games.value = response.value;
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
};

// Memanggil fetchGames saat halaman dimuat pertama kali
try {
  await fetchGames();
} catch (error) {
  if (error.statusCode === 401) {
    try {
      await useFetch("/api/token");
      await fetches();
    } catch (tokenError) {
      console.error("Error saat mendapatkan token:", tokenError);
    }
  } else {
    console.error("Error saat memuat data:", error);
  }
}

// Memanggil fetchGames setiap kali route.query berubah
watch(() => route.query, fetchGames, { deep: true });

useHead({
  title: "Search",
  meta: [
    {
      name: "description",
      content: "Search for your favorite games",
    },
  ],
});
</script>

<template>
  <div>
    <h1 class="sr-only">Search</h1>

    <!-- List of Games -->
    <div
      class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <div v-if="games.length > 0" v-for="game in games" :key="game.id">
        <GameCard :game="game" />
      </div>
    </div>
  </div>
</template>
