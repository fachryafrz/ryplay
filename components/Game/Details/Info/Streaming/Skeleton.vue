<script setup></script>

<template>
  <div class="relative w-full [&_#swiper-navigation_button]:hover:opacity-100">
    <Swiper
        :modules="[SwiperFreeMode]"
      :free-mode="true"
      :slides-per-view="`auto`"
      :slides-per-group="1"
      :space-between="8"
      class="rounded-xl"
    >
      <SwiperSlide
        v-for="(_, i) in 5"
        :key="i"
        class="max-w-[calc(100%/1.1)] @3xl:max-w-[calc(100%/2.1)]"
      >
        <div
          class="aspect-video animate-pulse rounded-xl bg-gray-400 bg-opacity-20"
        ></div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
