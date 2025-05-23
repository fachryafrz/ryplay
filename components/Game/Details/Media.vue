<script setup>
import LiteYouTubeEmbed from "vue-lite-youtube-embed";
import "vue-lite-youtube-embed/style.css";

const appConfig = useAppConfig();

const { game } = defineProps(["game"]);

const mainSwiper = ref(null);
const thumbSwiper = ref(null);
const activeSlide = ref(0);
const APP_URL = encodeURI(appConfig.url);
const swiperSlideClass =
  "!max-w-[calc(100%/2)] sm:!max-w-[calc(100%/3)] md:!max-w-[calc(100%/4)] lg:!max-w-[calc(100%/5)]";

const setMainSwiper = (swiper) => (mainSwiper.value = swiper);
const setThumbSwiper = (swiper) => (thumbSwiper.value = swiper);
const setActiveSlide = () => (activeSlide.value = mainSwiper.value.activeIndex);

const youtubeParams = ref();

onMounted(() => {
  youtubeParams.value = new URLSearchParams({
    rel: 0,
    start: 0,
    enablejsapi: 1,
    origin: window.location.origin,
    widget_referrer: window.location.href,
  });
});
</script>

<template>
  <div class="relative flex flex-col gap-1">
    <!-- Big -->
    <div
      class="relative -mx-4 overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:hidden before:bg-gradient-to-t before:from-base-100 lg:mx-0 lg:rounded-xl xl:before:hidden"
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
        <SwiperSlide v-for="video in game.videos" :key="video.video_id">
          <figure class="aspect-video w-full overflow-hidden bg-base-100">
            <LiteYouTubeEmbed
              :id="video.video_id"
              :title="video.name"
              :cookie="true"
              :params="youtubeParams?.toString()"
              poster="maxresdefault"
            />
          </figure>
        </SwiperSlide>

        <SwiperSlide
          v-for="screenshot in game.screenshots"
          :key="screenshot.image_id"
        >
          <figure class="aspect-video overflow-hidden bg-base-100">
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`"
              :alt="game.name"
              class="object-contain"
              draggable="false"
              loading="lazy"
            />
          </figure>
        </SwiperSlide>
        <SwiperSlide v-for="artwork in game.artworks" :key="artwork.image_id">
          <figure class="aspect-video overflow-hidden bg-base-100">
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_1080p/${artwork.image_id}.jpg`"
              :alt="game.name"
              class="object-contain"
              draggable="false"
              loading="lazy"
              @error="
                $event.target.style = `background-image:url(/logo/logo.svg); background-repeat:no-repeat; background-position:center; background-size: 10rem;`
              "
            />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Pagination -->
    <div
      v-if="game.videos || game.screenshots || game.artworks"
      class="relative z-10"
    >
      <div
        class="pointer-events-none absolute inset-0 z-10 hidden items-center justify-between px-2 lg:flex [&_*]:pointer-events-auto"
      >
        <button class="prev btn btn-primary btn-sm aspect-square px-0">
          <Icon name="ion:md-arrow-dropleft" size="20" />
        </button>
        <button class="next btn btn-primary btn-sm aspect-square px-0">
          <Icon name="ion:md-arrow-dropright" size="20" />
        </button>
      </div>

      <Swiper
        @swiper="setThumbSwiper"
        :modules="[SwiperThumbs, SwiperFreeMode]"
        :slides-per-view="3"
        :space-between="8"
        :watch-slides-progress="true"
        :free-mode="true"
        :breakpoints="{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }"
        :grab-cursor="true"
        class="!-mx-4 !px-4 !py-2 lg:!-mx-1 lg:!px-1"
        wrapper-class="[&_*]:rounded-lg lg:[&_*]:rounded-xl"
      >
        <SwiperSlide
          v-if="game.videos?.length > 0"
          v-for="(video, index) in game.videos"
          :key="video.video_id"
          :class="swiperSlideClass"
        >
          <figure
            class="relative aspect-video cursor-pointer overflow-hidden"
            :class="
              activeSlide === index
                ? 'outline-3 cursor-default border-4 border-base-100 outline outline-primary'
                : ''
            "
          >
            <img
              :src="`https://img.youtube.com/vi/${video.video_id}/0.jpg`"
              alt=""
              role="presentation"
              aria-hidden="true"
              class="block h-full w-full opacity-50"
              draggable="false"
              loading="lazy"
            />

            <div
              class="pointer-events-none absolute inset-0 grid place-content-center"
            >
              <span
                class="flex aspect-[4/3] justify-center rounded text-center text-base-100"
              >
                <Icon
                  name="ion:play-circle-outline"
                  size="40"
                  class="text-white"
                />
              </span>
            </div>
          </figure>
        </SwiperSlide>
        <SwiperSlide
          v-if="game.screenshots?.length > 0"
          v-for="(screenshot, index) in game.screenshots"
          :key="screenshot.image_id"
          :class="swiperSlideClass"
        >
          <figure
            class="aspect-video cursor-pointer overflow-hidden"
            :class="
              activeSlide === index + (game.videos?.length ?? 0)
                ? 'outline-3 cursor-default border-4 border-base-100 outline outline-primary'
                : ''
            "
          >
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${screenshot.image_id}.jpg`"
              alt=""
              role="presentation"
              aria-hidden="true"
              loading="lazy"
              class="block h-full w-full"
            />
          </figure>
        </SwiperSlide>
        <SwiperSlide
          v-if="game.artworks?.length > 0"
          v-for="(artwork, index) in game.artworks"
          :key="artwork.image_id"
          :class="swiperSlideClass"
        >
          <figure
            class="aspect-video cursor-pointer overflow-hidden"
            :class="
              activeSlide ===
              index +
                (game.videos?.length ?? 0) +
                (game.screenshots?.length ?? 0)
                ? 'outline-3 cursor-default border-4 border-base-100 outline outline-primary'
                : ''
            "
          >
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${artwork.image_id}.jpg`"
              alt=""
              role="presentation"
              aria-hidden="true"
              loading="lazy"
              class="block h-full w-full"
              @error="
                $event.target.style = `background-image:url(/logo/logo.svg); background-repeat:no-repeat; background-position:center;`
              "
            />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
