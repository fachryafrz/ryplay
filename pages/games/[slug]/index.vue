<script setup>
import GamePoster from "~/components/Game/Details/GameInfo/GamePoster.vue";
import GameInfo from "~/components/Game/Details/GameInfo/index.vue";
import GameMedia from "~/components/Game/Details/GameMedia.vue";

const config = useRuntimeConfig();
const { slug } = useRoute().params;

const game = ref([]);

const dayjs = useDayjs();
const gameCover = ref("");
const developers = ref([]);
const publishers = ref([]);
const gameInfo = ref([]);

const fetchGameDetails = async () => {
  const { data: response, error } = await useFetch("/api/games/details", {
    params: { slug },
  });

  if (error.value) {
    throw error.value;
  }

  const data = response.value[0];
  game.value = data;

  return data;
};

try {
  const data = await fetchGameDetails();

  useHead({
    title: `${data.name}`,
    meta: [
      { name: "description", content: `${data.summary}` },
      { property: "og:title", content: `${data.name}` },
      { property: "og:description", content: `${data.summary}` },
      { property: "og:image", content: `${gameCover.value}` },
      { property: "og:url", content: `${config.public.APP_URL}/games/${slug}` },
      { property: "og:site_name", content: `${config.public.APP_NAME}` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@fachryafrz" },
      { name: "twitter:description", content: `${data.summary}` },
      { name: "twitter:image", content: `${gameCover.value}` },
      {
        name: "twitter:title",
        content: `${data.name} at ${config.public.APP_NAME}`,
      },
    ],
  });
} catch (error) {
  if (error.statusCode === 401) {
    try {
      await useFetch("/api/token");
      await fetchGameDetails();
    } catch (tokenError) {
      console.error("Error saat mendapatkan token:", tokenError);
    }
  }
}
</script>

<template>
  <div class="mt-0.5 grid grid-cols-12 gap-4">
    <div class="order-2 col-span-full lg:order-1 lg:col-end-9 xl:col-end-10">
      <GameMedia :game="game" />
    </div>

    <div class="order-3 col-span-full lg:order-3 lg:col-end-9 xl:col-end-10">
      <GameInfo
        :game="game"
        :publishers="publishers"
        :developers="developers"
      />
    </div>

    <div
      class="order-1 col-span-full @container lg:order-2 lg:col-start-9 lg:row-span-2 xl:col-start-10"
    >
      <GamePoster :game="game" />
    </div>

    <div v-if="game.similar_games?.length > 0" class="order-4 col-span-full">
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
              spaceBetween: 16,
            },
            1024: {
              slidesPerGroup: 4,
              spaceBetween: 16,
            },
            1280: {
              slidesPerGroup: 5,
              spaceBetween: 16,
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
    </div>
  </div>
</template>
