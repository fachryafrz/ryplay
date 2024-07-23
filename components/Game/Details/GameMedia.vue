<script setup>
const { game } = defineProps(["game"]);

const mainSwiper = ref(null);
const thumbSwiper = ref(null);
const activeSlide = ref(0);

const setMainSwiper = (swiper) => (mainSwiper.value = swiper);
const setThumbSwiper = (swiper) => (thumbSwiper.value = swiper);
const setActiveSlide = () => (activeSlide.value = mainSwiper.value.activeIndex);
</script>

<template>
  <div class="relative -m-4">
    <!-- Big -->
    <div
      class="relative before:pointer-events-none before:absolute before:inset-0 before:z-10 before:bg-gradient-to-t before:from-base-100 before:via-base-100 before:via-5%"
    >
      <Swiper
        @swiper="setMainSwiper"
        :modules="[
          SwiperEffectFade,
          SwiperNavigation,
          SwiperKeyboard,
          SwiperThumbs,
          SwiperAutoplay,
        ]"
        v-on:slide-change="setActiveSlide"
        :slides-per-view="1"
        :space-between="16"
        :effect="'fade'"
        :keyboard="{ enabled: true }"
        :thumbs="{ swiper: thumbSwiper }"
        :navigation="{
          prevEl: '.prev',
          nextEl: '.next',
        }"
      >
        <!-- NOTE: Video -->

        <SwiperSlide v-for="screenshot in game.screenshots">
          <figure class="aspect-[4/2] overflow-hidden bg-base-100">
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`"
              :alt="game.name"
              class="object-contain"
            />
          </figure>
        </SwiperSlide>
        <SwiperSlide v-for="artwork in game.artworks">
          <figure class="aspect-[4/2] overflow-hidden bg-base-100">
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_1080p/${artwork.image_id}.jpg`"
              :alt="game.name"
              class="object-contain"
            />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Pagination -->
    <div class="absolute inset-x-0 bottom-0 z-10 translate-y-1/2 px-4">
      <div
        class="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-2 [&_*]:pointer-events-auto"
      >
        <button
          class="prev grid aspect-square w-8 place-content-center rounded-lg bg-primary px-0 text-9xl text-base-100"
        >
          <span class="material-symbols-outlined"> arrow_left </span>
        </button>
        <button
          class="next grid aspect-square w-8 place-content-center rounded-lg bg-primary px-0 text-9xl text-base-100"
        >
          <span class="material-symbols-outlined"> arrow_right </span>
        </button>
      </div>

      <Swiper
        @swiper="setThumbSwiper"
        :modules="[SwiperThumbs]"
        :slides-per-view="6"
        :space-between="16"
        :watch-slides-progress="true"
        :free-mode="true"
        class="!p-2"
      >
        <SwiperSlide v-for="(screenshot, index) in game.screenshots">
          <figure
            class="aspect-video overflow-hidden rounded-xl"
            :class="
              activeSlide === index
                ? 'outline-3 border-4 border-base-100 outline outline-primary'
                : ''
            "
          >
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${screenshot.image_id}.jpg`"
              :alt="game.name"
            />
          </figure>
        </SwiperSlide>
        <SwiperSlide v-for="(artwork, index) in game.artworks">
          <figure
            class="aspect-video overflow-hidden rounded-xl"
            :class="
              activeSlide === index + game.screenshots.length
                ? 'outline-3 border-4 border-base-100 outline outline-primary'
                : ''
            "
          >
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${artwork.image_id}.jpg`"
              :alt="game.name"
            />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
