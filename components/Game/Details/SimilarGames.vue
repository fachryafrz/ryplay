<script setup>
const { game } = defineProps(["game"]);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-bold">Similar Games</h2>
        <p class="text-sm text-neutral-500">
          Discover games similar to this one
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
      id="similarGames"
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
        v-for="game in game.similar_games"
        :key="game.slug"
        class="max-w-[calc(100%/1.8)] sm:max-w-[calc(100%/2.8)] md:max-w-[calc(100%/3.8)] lg:max-w-[calc(100%/4.8)] xl:max-w-[calc(100%/5.8)]"
      >
        <GameCard :game="game" :isHorizontal="false" />
      </SwiperSlide>
    </GameSlider>
  </div>
</template>
