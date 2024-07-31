<script setup>
const {
  id,
  breakpoints,
  slidesPerView,
  slidesPerGroup,
  spaceBetween,
  games,
  title,
  description,
  isHorizontal,
} = defineProps([
  "id",
  "breakpoints",
  "slidesPerView",
  "slidesPerGroup",
  "spaceBetween",
  "games",
  "title",
  "description",
  "isHorizontal",
]);

const defaultBreakpoints = {
  640: {
    slidesPerGroup: 3,
    slidesPerView: 3,
  },
  768: {
    slidesPerGroup: 4,
    slidesPerView: 4,
  },
  1024: {
    slidesPerGroup: 5,
    slidesPerView: 5,
  },
  1280: {
    slidesPerGroup: 6,
    slidesPerView: 6,
  },
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-end justify-between">
      <div>
        <NuxtLink
          to="/"
          class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
        >
          <h2 class="heading-2">{{ title }}</h2>
          <Icon name="ion:ios-arrow-forward" size="25" class="transition-all" />
        </NuxtLink>
        <p v-if="description" class="text-sm text-neutral-500">
          {{ description }}
        </p>
      </div>

      <div id="swiper-navigation" class="flex h-full gap-1">
        <button
          class="btn btn-primary btn-sm aspect-square px-0"
          :class="`${id}_prev `"
        >
          <Icon name="ion:md-arrow-dropleft" size="20" />
        </button>
        <button
          class="btn btn-primary btn-sm aspect-square px-0"
          :class="`${id}_next `"
        >
          <Icon name="ion:md-arrow-dropright" size="20" />
        </button>
      </div>

      <!-- <NuxtLink
        to="/"
        class="flex items-center gap-2 !bg-transparent text-sm font-medium text-primary [&_*]:transition-all first:[&_span]:hocus:-translate-x-1 last:[&_span]:hocus:scale-125"
      >
        <span class="whitespace-nowrap">See all</span>

        <span class="material-symbols-outlined text-sm">
          arrow_forward_ios
        </span>
      </NuxtLink> -->
    </div>

    <div
      class="relative w-full [&_#swiper-navigation_button]:hover:opacity-100"
    >
      <Swiper
        :modules="[SwiperNavigation]"
        :slides-per-view="slidesPerView || 3"
        :slides-per-group="slidesPerGroup || 3"
        :breakpoints="breakpoints || defaultBreakpoints"
        :space-between="spaceBetween || 8"
        :navigation="{
          prevEl: `.${id}_prev`,
          nextEl: `.${id}_next`,
        }"
        class="rounded-xl"
      >
        <SwiperSlide
          v-for="game in games"
          :key="game.slug"
          :class="
            !isHorizontal
              ? `max-w-[calc(100%/3)] md:max-w-[calc(100%/4)] lg:max-w-[calc(100%/5)] xl:max-w-[calc(100%/6)]`
              : `max-w-[calc(100%/2)] lg:max-w-[calc(100%/${slidesPerView || 3})]`
          "
        >
          <GameCard :game="game" :isHorizontal="isHorizontal" />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
