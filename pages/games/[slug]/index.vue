<script setup>
const config = useRuntimeConfig();
const { slug } = useRoute().params;

const { data: response, error } = await useFetch("/api/games/details", {
  params: { slug },
});

if (error.value) throw error.value;

const [game] = response.value;
const gameCover = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`;

useSeoMeta({
  title: () => game.name,
  description: () => `${game.storyline ?? game.summary}`,
  ogTitle: () => `${game.name} - ${config.public.APP_NAME}`,
  ogDescription: () => `${game.storyline ?? game.summary}`,
  ogImage: () => gameCover,
  ogUrl: () => `${config.public.APP_URL}/games/${slug}`,
  ogSiteName: () => config.public.APP_NAME,
  ogType: () => `website`,
  twitterCard: () => `summary_large_image`,
  twitterCreator: () => `@fachryafrz`,
  twitterDescription: () => `${game.storyline ?? game.summary}`,
  twitterImage: () => gameCover,
  twitterTitle: () => `${game.name} - ${config.public.APP_NAME}`,
});
</script>

<template>
  <div class="mx-auto mt-0.5 grid max-w-7xl grid-cols-12 gap-4">
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
      <GameDetailsInfo :game="game" />
    </div>
  </div>

  <div v-if="game.similar_games?.length > 0" class="col-span-full pt-4">
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
</template>
