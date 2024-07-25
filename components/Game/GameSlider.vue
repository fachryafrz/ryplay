<script setup>
const { id, breakpoints } = defineProps(["id", "breakpoints"]);
</script>

<template>
  <div class="relative w-full [&_#swiper-navigation_button]:hover:opacity-100">
    <div
      id="swiper-navigation"
      class="absolute inset-0 hidden items-center justify-between gap-4 md:flex [&_*]:pointer-events-auto [&_*]:z-20"
    >
      <button
        class="relative flex h-full items-center justify-start p-2 opacity-0 transition-all before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-[150px] before:bg-gradient-to-r before:from-base-100 before:opacity-90"
        :class="`${id}_prev`"
      >
        <span class="material-symbols-outlined text-primary">
          arrow_back_ios
        </span>
      </button>
      <button
        class="relative flex h-full items-center justify-start p-2 opacity-0 transition-all before:pointer-events-none before:absolute before:inset-y-0 before:right-0 before:z-10 before:w-[150px] before:bg-gradient-to-l before:from-base-100 before:opacity-90"
        :class="`${id}_next`"
      >
        <span class="material-symbols-outlined text-primary">
          arrow_forward_ios
        </span>
      </button>
    </div>

    <Swiper
      :modules="[SwiperNavigation]"
      slides-per-view="auto"
      :breakpoints="breakpoints"
      :space-between="8"
      :navigation="{
        prevEl: `.${id}_prev`,
        nextEl: `.${id}_next`,
      }"
      class="rounded-xl"
    >
      <slot />
    </Swiper>
  </div>
</template>
