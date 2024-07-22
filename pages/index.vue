<script setup>
useHead({
  meta: [
    {
      name: "description",
      content: "GameCove is a platform for discovering new games.",
    },
  ],
});

const games = ref([]);

onMounted(async () => {
  try {
    const response = await $fetch("/api/games");

    games.value = response;
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
});
</script>

<template>
  <Header />

  <section>
    <div>
      <h2 class="text-2xl font-bold">Featured Content</h2>

      <ul>
        <li v-for="game in games">
          <!-- <GameCard :game="game" /> -->
          <div>
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${game.screenshots[0].image_id}.jpg`"
              :alt="game.name"
            />
            <h3>{{ game.name }}</h3>
            <p>{{ game.summary }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
  <section>
    <div>
      <h2 class="text-2xl font-bold">Top Picks For You</h2>
      <p class="text-sm text-neutral-500">
        Discover games curated only for you
      </p>
    </div>
  </section>
  <section>
    <div>
      <h2 class="text-2xl font-bold">Top Deals For You</h2>
      <p class="text-sm text-neutral-500">Get best discounts on best games</p>
    </div>
  </section>
</template>
