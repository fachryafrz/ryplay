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
  <div class="relative flex flex-col gap-1">
    <!-- Big -->
    <div
      class="relative rounded-xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:hidden before:bg-gradient-to-t before:from-base-100 xl:before:hidden"
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
        <SwiperSlide v-for="video in game.videos">
          <figure class="aspect-video w-full overflow-hidden bg-base-100">
            <iframe
              :src="`https://youtube.com/embed/${video.video_id}?rel=0&start=0&loop=0&playlist=${video.video_id}`"
              frameborder="0"
              allowfullscreen
              class="h-full w-full rounded-xl"
            ></iframe>
          </figure>
        </SwiperSlide>

        <SwiperSlide v-for="screenshot in game.screenshots">
          <figure
            class="aspect-video overflow-hidden bg-base-100"
          >
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`"
              :alt="game.name"
              class="rounded-xl object-contain"
            />
          </figure>
        </SwiperSlide>
        <SwiperSlide v-for="artwork in game.artworks">
          <figure
            class="aspect-video overflow-hidden bg-base-100"
          >
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_1080p/${artwork.image_id}.jpg`"
              :alt="game.name"
              class="rounded-xl object-contain"
            />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Pagination -->
    <div class="relative z-10">
      <div
        class="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-3 [&_*]:pointer-events-auto"
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
        :slides-per-view="2"
        :space-between="8"
        :watch-slides-progress="true"
        :free-mode="true"
        :breakpoints="{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }"
        class="!px-1 !py-2 !-m-1"
      >
        <SwiperSlide v-for="(video, index) in game.videos">
          <figure
            class="relative aspect-video overflow-hidden rounded-xl"
            :class="
              activeSlide === index
                ? 'outline-3 border-4 border-base-100 outline outline-primary'
                : ''
            "
          >
            <img
              :src="`https://img.youtube.com/vi/${video.video_id}/0.jpg`"
              :alt="game.name"
            />

            <div
              class="pointer-events-none absolute inset-0 grid place-content-center"
            >
              <span
                class="flex aspect-[4/3] justify-center rounded text-center text-base-100"
              >
                <svg
                  height="24px"
                  style="enable-background: new 0 0 32 32"
                  version="1.1"
                  viewBox="0 0 32 32"
                  width="24px"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <g id="Layer_1" />
                  <g id="play_x5F_alt">
                    <path
                      d="M16,0C7.164,0,0,7.164,0,16s7.164,16,16,16s16-7.164,16-16S24.836,0,16,0z M10,24V8l16.008,8L10,24z   "
                      style="fill: #ffffff"
                    />
                  </g>
                </svg>
              </span>
            </div>
          </figure>
        </SwiperSlide>
        <SwiperSlide v-for="(screenshot, index) in game.screenshots">
          <figure
            class="aspect-video overflow-hidden rounded-xl"
            :class="
              activeSlide === index + game.videos.length
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
              activeSlide ===
              index + game.videos.length + game.screenshots.length
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
