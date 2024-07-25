<script setup>
const route = useRoute();
const games = ref([]);

// Fungsi untuk mengambil data berdasarkan query params
const fetchGames = async () => {
  const { query, rating, genre, platform, release_date } = route.query;

  try {
    const response = await $fetch("/api/games/search", {
      params: {
        query,
        rating,
        genre,
        platform,
        release_date,
      },
    });

    games.value = response;
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
};

// Memanggil fetchGames saat halaman dimuat pertama kali
await fetchGames();

// Memanggil fetchGames setiap kali route.query berubah
watch(() => route.query, fetchGames, { deep: true });
</script>

<template>
  <div>
    <h1 class="sr-only">Search</h1>

    <!-- List of Games -->
    <div
      class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <div v-if="games.length > 0" v-for="game in games" :key="game.id">
        <GameCard :game="game" />
      </div>
    </div>
  </div>
</template>
