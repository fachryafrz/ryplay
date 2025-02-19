<script setup>
const config = useRuntimeConfig();
const { slug } = useRoute().params;

const { data: response, error } = await useFetch("/api/games/details", {
  params: { slug: `"${slug}"` },
});

if (error.value) throw error.value;

const [game] = response.value;
const gameCover = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`;
const gameDescription = (game.storyline ?? game.summary ?? "").replace(
  /(\r\n|\n|\r)/gm,
  " ",
);

useSeoMeta({
  title: () => game.name,
  description: () => gameDescription,
  ogTitle: () => `${game.name} - ${config.public.APP_NAME}`,
  ogDescription: () => gameDescription,
  ogImage: () => gameCover,
  ogUrl: () => `${config.public.APP_URL}/games/${slug}`,
  ogSiteName: () => config.public.APP_NAME,
  ogType: () => `website`,
  twitterCard: () => `summary_large_image`,
  twitterCreator: () => `@fachryafrz`,
  twitterDescription: () => gameDescription,
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

  <div
    v-if="game.similar_games?.length > 0"
    class="col-span-full mx-auto max-w-7xl pt-4"
  >
    <GameSlider
      id="similarGames"
      :games="game.similar_games"
      title="Similar Games"
      description="Discover games similar to this one"
      :breakpoints="{
        768: {
          slidesPerGroup: 4,
          slidesPerView: 4,
        },
        1024: {
          slidesPerGroup: 5,
          slidesPerView: 5,
        },
      }"
    />
  </div>
</template>
