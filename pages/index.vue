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

const featuredGames = ref([]);
const games = ref([]);
const hoveredIndex = ref(null);
const lastHoveredIndex = ref(0);

onMounted(async () => {
  try {
    const response = await $fetch("/api/games");

    featuredGames.value = response.slice(0, 4);
    games.value = response;
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
});
</script>

<template>
  <Header />

  <section>
    <div class="flex flex-col gap-2">
      <div>
        <h2 class="text-2xl font-bold">Featured Games</h2>
      </div>

      <!-- Featured Games -->
      <div class="flex gap-4 overflow-x-clip">
        <FeaturedGameCard />
      </div>
    </div>
  </section>
  <section>
    <div class="flex flex-col gap-4">
      <div class="">
        <h2 class="text-2xl font-bold">Top Picks For You</h2>
        <p class="text-sm text-neutral-500">
          Discover games curated only for you
        </p>
      </div>

      <div class="hover: relative w-full">
        <div
          id="swiper-navigation"
          class="absolute inset-0 flex items-center justify-between gap-4 [&_*]:pointer-events-auto [&_*]:z-20"
        >
          <button
            class="prev relative flex h-full items-center justify-start p-2 transition-all before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-[150px] before:bg-gradient-to-r before:from-base-100"
          >
            <span class="material-symbols-outlined text-primary">
              arrow_back_ios
            </span>
          </button>
          <button
            class="next relative flex h-full items-center justify-start p-2 transition-all before:pointer-events-none before:absolute before:inset-y-0 before:right-0 before:z-10 before:w-[150px] before:bg-gradient-to-l before:from-base-100"
          >
            <span class="material-symbols-outlined text-primary">
              arrow_forward_ios
            </span>
          </button>
        </div>

        <Swiper
          :modules="[SwiperNavigation]"
          slides-per-view="auto"
          :space-between="16"
          :effect="'creative'"
          :navigation="{
            prevEl: '.prev',
            nextEl: '.next',
          }"
          class="rounded-xl"
        >
          <SwiperSlide
            v-for="game in games"
            :key="game.slug"
            class="max-w-[calc(100%/6.8)]"
          >
            <GameCard :game="game" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>
