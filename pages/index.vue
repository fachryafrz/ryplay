<script setup>
import ExpandableGameCard from "~/components/Game/ExpandableGameCard.vue";
import HomeSlider from "~/components/Game/HomeSlider.vue";

const config = useRuntimeConfig();

const upcomingGames = ref([]);
const popularGames = ref([]);
const featuredGames = ref([]);
const topPicksGames = ref([]);
const topDealsGames = ref([]);

const fetches = async () => {
  const multiqueryResponse = await $fetch("/api/multi-query");

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

  const popularityData = multiqueryResponse.find(
    (res) => res.name === "popularity-data",
  ).result;

  const popularGamesResponse = await $fetch("/api/games/details", {
    params: {
      id: `(${popularityData.map((data) => data.game_id).join(",")})`,
      sort: `hypes desc`,
      limit: 20,
    },
  });

  popularGames.value = popularGamesResponse;
};

try {
  await fetches();
} catch (error) {
  if (error.statusCode === 401) {
    try {
      await $fetch("/api/token");
      await fetches();
    } catch (tokenError) {
      console.error("Error saat mendapatkan token:", tokenError);
    }
  }
}
</script>

<template>
  <h1 class="sr-only">{{ config.public.APP_NAME }}</h1>

  <div class="flex flex-col gap-4">
    <section>
      <HomeSlider :games="featuredGames" />
    </section>

    <section class="my-2">
      <div class="flex flex-col gap-2">
        <div>
          <h2 class="text-2xl font-bold">Upcoming Games</h2>
        </div>

        <!-- Upcoming Games -->
        <div class="grid grid-cols-2 gap-4 lg:flex lg:overflow-x-auto">
          <ExpandableGameCard :games="upcomingGames" />
        </div>
      </div>
    </section>

    <section class="my-2">
      <div class="flex flex-col gap-4">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-bold">Popular Right Now</h2>
            <p class="text-sm text-neutral-500">Popular Games Of The Week</p>
          </div>

          <NuxtLink
            to="/"
            class="flex items-center gap-2 !bg-transparent text-sm font-medium text-primary [&_*]:transition-all first:[&_span]:hocus:-translate-x-1 last:[&_span]:hocus:scale-125"
          >
            <span class="whitespace-nowrap">See all</span>

            <span class="material-symbols-outlined text-sm">
              arrow_forward_ios
            </span>
          </NuxtLink>
        </div>

        <GameSlider
          id="popularGames"
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
            v-for="game in popularGames"
            :key="game.slug"
            class="max-w-[calc(100%/1.8)] sm:max-w-[calc(100%/2.8)] md:max-w-[calc(100%/3.8)] lg:max-w-[calc(100%/4.8)] xl:max-w-[calc(100%/5.8)]"
          >
            <GameCard :game="game" :isHorizontal="false" />
          </SwiperSlide>
        </GameSlider>
      </div>
    </section>

    <section class="my-2">
      <div class="flex flex-col gap-4">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-bold">Top Rated</h2>
            <p class="text-sm text-neutral-500">
              Most Popular Games Of All Time
            </p>
          </div>

          <NuxtLink
            to="/"
            class="flex items-center gap-2 !bg-transparent text-sm font-medium text-primary [&_*]:transition-all first:[&_span]:hocus:-translate-x-1 last:[&_span]:hocus:scale-125"
          >
            <span class="whitespace-nowrap">See all</span>

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

    <section class="my-2">
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Top Deals For You</h2>
          <p class="text-sm text-neutral-500">
            Get Best Discounts on Best Games
          </p>
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
            class="max-w-[calc(100%/1.1)] md:max-w-[calc(100%/2.1)] lg:max-w-[calc(100%/3.1)]"
          >
            <GameCard :game="game" :isHorizontal="true" />
          </SwiperSlide>
        </GameSlider>
      </div>
    </section>
  </div>
</template>
