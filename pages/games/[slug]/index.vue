<script setup>
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
  gameCover.value = `https://images.igdb.com/igdb/image/upload/t_720p/${data.cover.image_id}.jpg`;

  return data;
};

try {
  const data = await fetchGameDetails();

  useHead({
    title: `${data.name}`,
    meta: [
      { name: `description`, content: `${data.summary}` },
      { property: `og:title`, content: `${data.name}` },
      { property: `og:description`, content: `${data.summary}` },
      { property: `og:image`, content: `${gameCover.value}` },
      { property: `og:url`, content: `${config.public.APP_URL}/games/${slug}` },
      { property: `og:site_name`, content: `${config.public.APP_NAME}` },
      { property: `og:type`, content: `website` },
      { name: `twitter:card`, content: `summary_large_image` },
      { name: `twitter:creator`, content: `@fachryafrz` },
      { name: `twitter:description`, content: `${data.summary}` },
      { name: `twitter:image`, content: `${gameCover.value}` },
      {
        name: `twitter:title`,
        content: `${data.name} at ${config.public.APP_NAME}`,
      },
    ],
  });
} catch (error) {
  console.error("Failed to fetch game details:", error);
}
</script>

<template>
  <div class="mt-0.5 grid grid-cols-12 gap-4">
    <div
      class="col-span-full @container lg:col-start-9 lg:row-span-2 xl:col-start-10"
    >
      <GameDetailsPoster :game="game" :game-cover="gameCover" />
    </div>

    <div
      v-if="game.videos || game.screenshots || game.artworks"
      class="col-span-full lg:col-end-9 lg:row-start-1 xl:col-end-10"
    >
      <GameDetailsMedia :game="game" />
    </div>

    <div
      class="col-span-full lg:col-end-9 lg:row-start-1 xl:col-end-10"
      :class="{
        'lg:row-start-2': game.videos || game.screenshots || game.artworks,
      }"
    >
      <GameDetailsInfo
        :game="game"
        :publishers="publishers"
        :developers="developers"
      />
    </div>

    <div v-if="game.similar_games?.length > 0" class="col-span-full">
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="heading-2">Similar Games</h2>
          <p class="text-sm text-neutral-500">
            Discover games similar to this one
          </p>
        </div>
        <GameGrid :games="game.similar_games" />
      </div>
    </div>
  </div>
</template>
