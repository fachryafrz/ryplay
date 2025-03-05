<script setup>
const { games } = defineProps(["games"]);

const secondSwiper = ref(null);
const thirdSwiper = ref(null);
const fourthSwiper = ref(null);

const setSecondSwiper = (swiper) => (secondSwiper.value = swiper);
const setThirdSwiper = (swiper) => (thirdSwiper.value = swiper);
const setFourthSwiper = (swiper) => (fourthSwiper.value = swiper);
</script>

<template>
  <div
    class="grid grid-cols-2 gap-2 md:grid-cols-6 lg:grid-rows-4 [&_>_*]:rounded-2xl"
  >
    <div
      class="col-span-full aspect-poster overflow-hidden sm:aspect-video md:col-span-4 md:aspect-auto lg:row-span-full"
    >
      <Swiper
        :modules="[
          SwiperController,
          SwiperEffectFade,
          SwiperKeyboard,
          SwiperAutoplay,
        ]"
        :controller="{ control: [secondSwiper, thirdSwiper, fourthSwiper] }"
        effect="fade"
        :keyboard="{ enabled: true }"
        class="h-full"
      >
        <SwiperSlide v-for="game in games" :key="game.slug" class="relative">
          <figure class="aspect-poster h-full sm:aspect-video">
            <picture>
              <source
                media="(min-width: 640px)"
                :srcset="`https://images.igdb.com/igdb/image/upload/t_1080p/${game?.artworks[0]?.image_id}.jpg`"
              />
              <img
                :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`"
                alt=""
                role="presentation"
                aria-hidden="true"
                loading="lazy"
                draggable="false"
                class="min-h-full w-full bg-cover bg-center"
              />
            </picture>
          </figure>
          <div
            class="absolute inset-x-0 top-0 hidden flex-wrap gap-2 p-4 md:flex"
          >
            <NuxtLink
              v-for="genre in game.genres"
              :key="genre.slug"
              :to="`/search?genre=${genre.slug}`"
              class="btn btn-sm border-none bg-opacity-75 backdrop-blur"
            >
              {{ genre.name }}
            </NuxtLink>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <div
      class="hidden overflow-hidden sm:block md:order-3 md:col-[1/3] md:row-[2/4] md:aspect-auto lg:col-[5/6] lg:row-[4/5]"
    >
      <Swiper
        @swiper="setThirdSwiper"
        :modules="[SwiperEffectFade]"
        effect="fade"
        :allow-slide-next="false"
        :allow-slide-prev="false"
        :allow-touch-move="false"
        class="h-full"
      >
        <SwiperSlide v-for="game in games" :key="game.slug">
          <figure class="h-full overflow-hidden">
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${game?.screenshots[0]?.image_id}.jpg`"
              alt=""
              role="presentation"
              aria-hidden="true"
              loading="lazy"
              draggable="false"
              class="block h-full w-full bg-cover bg-center"
            />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>

    <div
      class="hidden overflow-hidden sm:block md:order-4 md:col-[3/5] md:row-[2/4] md:aspect-auto lg:col-[6/7] lg:row-[4/5]"
    >
      <Swiper
        @swiper="setFourthSwiper"
        :modules="[SwiperEffectFade]"
        effect="fade"
        :allow-slide-next="false"
        :allow-slide-prev="false"
        :allow-touch-move="false"
        class="h-full"
      >
        <SwiperSlide v-for="game in games" :key="game.slug">
          <figure class="aspect-video h-full overflow-hidden">
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${game?.screenshots[1]?.image_id}.jpg`"
              alt=""
              role="presentation"
              aria-hidden="true"
              loading="lazy"
              draggable="false"
              class="block h-full w-full bg-cover bg-center"
            />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>

    <div
      class="col-span-full overflow-hidden sm:col-[2/3] sm:row-[2/4] md:order-2 md:col-[5/7] md:row-[1/4] md:aspect-auto"
    >
      <Swiper
        @swiper="setSecondSwiper"
        :modules="[SwiperEffectFade, SwiperController]"
        effect="fade"
        :allow-slide-next="false"
        :allow-slide-prev="false"
        :allow-touch-move="false"
        :watch-slides-progress="true"
        class="h-full"
      >
        <SwiperSlide v-for="game in games" :key="game.slug" class="relative">
          <div
            class="relative z-10 flex h-full flex-col gap-4 p-4 backdrop-blur-xl lg:p-6"
          >
            <h2
              class="line-clamp-2 text-pretty text-center text-3xl xl:text-4xl font-semibold !leading-normal text-white md:text-start xl:line-clamp-3"
            >
              {{ game.name }}
            </h2>
            <div
              class="flex flex-wrap justify-center gap-1 md:hidden md:justify-start"
            >
              <NuxtLink
                v-for="genre in game.genres"
                :key="genre.slug"
                :to="`/search?genre=${genre.slug}`"
                class="btn btn-sm border-none bg-opacity-50 backdrop-blur"
              >
                {{ genre.name }}
              </NuxtLink>
            </div>

            <p
              class="mb-4 line-clamp-3 text-pretty text-sm text-white sm:line-clamp-5"
            >
              {{ game.storyline || game.summary }}
            </p>

            <div class="mt-auto flex flex-row items-end justify-between gap-2">
              <NuxtLink
                :to="`/games/${game.slug}`"
                class="btn !btn-primary w-full xl:max-w-32"
              >
                Details
              </NuxtLink>

              <!-- <span
                class="flex flex-wrap items-center justify-center gap-2 md:justify-end"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Windows_logo_-_2012_%28dark_blue%29.svg/2048px-Windows_logo_-_2012_%28dark_blue%29.svg.png"
                  alt="Windows"
                  class="w-4 object-contain brightness-0 invert"
                  draggable="false"
          loading="lazy"
                />
              </span> -->
            </div>
          </div>

          <figure
            class="absolute inset-0 scale-[2.0] blur-xl before:absolute before:inset-0 before:z-10 before:bg-base-100 before:opacity-[50%]"
          >
            <img
              :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${game?.artworks[0]?.image_id}.jpg`"
              alt=""
              role="presentation"
              aria-hidden="true"
              loading="lazy"
              draggable="false"
              class="block h-full w-full bg-cover bg-center bg-no-repeat motion-safe:animate-spin-slow"
            />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
