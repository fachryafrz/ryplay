<script setup>
import FeaturedGameCard from "~/components/Game/FeaturedGameCard.vue";

useHead({
  meta: [
    {
      name: "description",
      content: "GameCove is a platform for discovering new games.",
    },
  ],
});

const topPicksGames = ref([]);
const topDealsGames = ref([]);

try {
  const topPicksGamesResponse = await $fetch("/api/games/top-picks");
  const topDealsGamesResponse = await $fetch("/api/games/featured");

  topPicksGames.value = topPicksGamesResponse;
  topDealsGames.value = topDealsGamesResponse;
} catch (error) {
  console.error("Failed to fetch games:", error);
}
</script>

<template>
  <Header />

  <section>
    <div class="flex flex-col gap-2">
      <div>
        <h2 class="text-2xl font-bold">Featured Games</h2>
      </div>

      <!-- Featured Games -->
      <div class="grid grid-cols-2 gap-4 overflow-x-auto lg:flex">
        <FeaturedGameCard />
      </div>
    </div>
  </section>

  <section>
    <div class="flex flex-col gap-4">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-bold">Top Picks For You</h2>
          <p class="text-sm text-neutral-500">
            Discover games curated only for you
          </p>
        </div>

        <NuxtLink
          to="/"
          class="flex items-center gap-2 !bg-transparent text-sm font-medium text-primary [&_*]:transition-all first:[&_span]:hocus:-translate-x-1 last:[&_span]:hocus:scale-125"
        >
          <span>See all</span>

          <span class="material-symbols-outlined text-sm">
            arrow_forward_ios
          </span>
        </NuxtLink>
      </div>

      <GameSlider
        id="topPicksGames"
        :breakpoints="{
          640: {
            slidesPerGroup: 3,
          },
          768: {
            slidesPerGroup: 4,
          },
          1024: {
            slidesPerGroup: 5,
          },
        }"
      >
        <SwiperSlide
          v-for="game in topPicksGames"
          :key="game.slug"
          class="max-w-[calc(100%/2.8)] sm:max-w-[calc(100%/3.8)] md:max-w-[calc(100%/4.8)] lg:max-w-[calc(100%/5.8)]"
        >
          <GameCard :game="game" :isHorizontal="false" />
        </SwiperSlide>
      </GameSlider>
    </div>
  </section>

  <section>
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="text-2xl font-bold">Top Deals For You</h2>
        <p class="text-sm text-neutral-500">Get Best Discounts on Best Games</p>
      </div>

      <GameSlider id="topDealsGames" :breakpoints="{
        768: {
          slidesPerGroup: 2,
        },
        1024: {
          slidesPerGroup: 3,
        },
      }">
        <SwiperSlide
          v-for="game in topDealsGames"
          :key="game.slug"
          class="max-w-[calc(100%/1.5)] md:max-w-[calc(100%/2.5)] lg:max-w-[calc(100%/3.5)]"
        >
          <GameCard :game="game" :isHorizontal="true" />
        </SwiperSlide>
      </GameSlider>
    </div>
  </section>
</template>
