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
  seeAll,
  className,
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
  "seeAll",
  "className",
]);

const defaultBreakpoints = {
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
  <div class="flex flex-col gap-2 @container">
    <div class="flex items-end justify-between">
      <div>
        <h2 v-if="!seeAll" class="heading-2">{{ title }}</h2>

        <NuxtLink
          v-if="seeAll"
          :to="seeAll"
          :prefetch="false"
          class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
        >
          <h2 class="heading-2">{{ title }}</h2>
          <Icon name="ion:ios-arrow-forward" class="transition-all sm:size-6" />
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
    </div>

    <div
      class="relative w-full [&_#swiper-navigation_button]:hover:opacity-100"
    >
      <Swiper
        :modules="[SwiperNavigation]"
        :slides-per-view="slidesPerView || `auto`"
        :slides-per-group="slidesPerGroup || 2"
        :breakpoints="breakpoints || defaultBreakpoints"
        :space-between="spaceBetween || 8"
        :navigation="{
          prevEl: `.${id}_prev`,
          nextEl: `.${id}_next`,
        }"
        :class="className || '!-mx-4 !px-4'"
      >
        <SwiperSlide
          v-for="game in games"
          :key="game.slug"
          :class="
            !isHorizontal
              ? `max-w-[calc(100%/2.5)] @3xl:max-w-[calc(100%/4)]`
              : `max-w-[calc(100%/1.25)] @3xl:max-w-[calc(100%/2.25)]`
          "
        >
          <GameCard :game="game" :isHorizontal="isHorizontal" />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
