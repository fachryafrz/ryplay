<script setup>
const { isHorizontal } = defineProps(["isHorizontal"]);
const loadingClass = "animate-pulse bg-gray-400 bg-opacity-20";
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

const SLIDER_COUNT = 6;
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-end justify-between">
      <div class="flex flex-col gap-1">
        <span :class="`block h-7 w-44 rounded ${loadingClass}`"></span>
        <span :class="`block h-4 w-48 rounded ${loadingClass}`"></span>
      </div>
    </div>

    <div
      class="relative w-full [&_#swiper-navigation_button]:hover:opacity-100"
    >
      <Swiper
        :modules="[SwiperNavigation]"
        :slides-per-view="`auto`"
        :slides-per-group="2"
        :breakpoints="defaultBreakpoints"
        :space-between="8"
        :allow-slide-next="false"
        :allow-slide-prev="false"
        :allow-touch-move="false"
      >
        <SwiperSlide
          v-for="slider in SLIDER_COUNT"
          :key="slider"
          :class="
            !isHorizontal
              ? `max-w-[calc(100%/2.5)] md:max-w-[calc(100%/4)] lg:max-w-[calc(100%/5)] xl:max-w-[calc(100%/6)]`
              : `max-w-[calc(100%/1.25)] md:max-w-[calc(100%/2.25)] lg:max-w-[calc(100%/3)]`
          "
        >
          <span
            :class="`block aspect-poster rounded-xl ${loadingClass}`"
          ></span>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
