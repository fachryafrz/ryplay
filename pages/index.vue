<script setup>
import FeaturedGameCard from "~/components/Game/FeaturedGameCard.vue";
import HomeSlider from "~/components/Game/HomeSlider.vue";

const config = useRuntimeConfig();

useHead({
  meta: [
    {
      name: "description",
      content: "GameCove is a platform for discovering new games.",
    },
  ],
});

const upcomingGames = ref([]);
const featuredGames = ref([]);
const topPicksGames = ref([]);
const topDealsGames = ref([]);

try {
  const multiqueryResponse = await $fetch("/api/multi-query");
  // const upcomingGamesResponse = await $fetch("/api/games/upcoming");
  // const featuredGamesResponse = await $fetch("/api/games/featured");
  // const topPicksGamesResponse = await $fetch("/api/games/top-picks");
  // const topDealsGamesResponse = await $fetch("/api/games/featured");

  upcomingGames.value = multiqueryResponse.find(
    (res) => res.name === "upcoming",
  ).result;
  featuredGames.value = multiqueryResponse.find(
    (res) => res.name === "featured",
  ).result;
  topPicksGames.value = multiqueryResponse.find(
    (res) => res.name === "top-picks",
  ).result;
  topDealsGames.value = multiqueryResponse.find(
    (res) => res.name === "featured",
  ).result;
} catch (error) {
  console.error("Failed to fetch games:", error);
}
</script>

<template>
  <Header />

  <h1 class="sr-only">{{ config.public.APP_NAME }}</h1>

  <section>
    <HomeSlider :games="upcomingGames" />
  </section>

  <section>
    <div class="flex flex-col gap-2">
      <div>
        <h2 class="text-2xl font-bold">Featured Games</h2>
      </div>

      <!-- Featured Games -->
      <div class="grid grid-cols-2 gap-4 overflow-x-auto lg:flex">
        <FeaturedGameCard :games="featuredGames" />
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
            slidesPerGroup: 2,
          },
          768: {
            slidesPerGroup: 3,
          },
          1024: {
            slidesPerGroup: 4,
          },
          1280: {
            slidesPerGroup: 5,
          },
        }"
      >
        <SwiperSlide
          v-for="game in topPicksGames"
          :key="game.slug"
          class="max-w-[calc(100%/1.8)] sm:max-w-[calc(100%/2.8)] md:max-w-[calc(100%/3.8)] lg:max-w-[calc(100%/4.8)] xl:max-w-[calc(100%/5.8)]"
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

      <GameSlider
        id="topDealsGames"
        :breakpoints="{
          768: {
            slidesPerGroup: 2,
          },
          1024: {
            slidesPerGroup: 3,
          },
        }"
      >
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
