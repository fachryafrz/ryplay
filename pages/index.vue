<script setup>
const config = useRuntimeConfig();

const { data: multiqueryResponse, error } = await useFetch("/api/multi-query");

if (error.value) throw error.value;

const featuredGames = multiqueryResponse.value.find(
  (res) => res.name === "featured",
).result;
const upcomingGames = multiqueryResponse.value.find(
  (res) => res.name === "upcoming",
).result;
const topRatedGames = multiqueryResponse.value.find(
  (res) => res.name === "top-rated",
).result;
const newReleases = multiqueryResponse.value.find(
  (res) => res.name === "new-releases",
).result;
const mostAnticipated = multiqueryResponse.value.find(
  (res) => res.name === "most-anticipated",
).result;
const indie = multiqueryResponse.value.find(
  (res) => res.name === "indie",
).result;
const shooter = multiqueryResponse.value.find(
  (res) => res.name === "shooter",
).result;
const racing = multiqueryResponse.value.find(
  (res) => res.name === "racing",
).result;
const sports = multiqueryResponse.value.find(
  (res) => res.name === "sports",
).result;
// ============== PopScore ==============
const popularityData = multiqueryResponse.value.find(
  (res) => res.name === "popularity-data",
).result;
const mostPlayedData = multiqueryResponse.value.find(
  (res) => res.name === "most-played-data",
).result;
const playingData = multiqueryResponse.value.find(
  (res) => res.name === "playing-data",
).result;
const wantToPlayData = multiqueryResponse.value.find(
  (res) => res.name === "want-to-play-data",
).result;

const { data: popularGames, error: popularGamesError } = await useLazyFetch(
  "/api/games/details",
  {
    params: {
      id: `(${popularityData.map((data) => data.game_id).join(",")})`,
      sort: `hypes desc`,
      limit: 20,
    },
  },
);
const { data: mostPlayed, error: mostPlayedError } = await useLazyFetch(
  "/api/games/details",
  {
    params: {
      id: `(${mostPlayedData
        .slice(0, 5)
        .map((data) => data.game_id)
        .join(",")})`,
      limit: 5,
    },
  },
);
const { data: playing, error: playingError } = await useLazyFetch(
  "/api/games/details",
  {
    params: {
      id: `(${playingData
        .slice(0, 5)
        .map((data) => data.game_id)
        .join(",")})`,
      limit: 5,
    },
  },
);
const { data: wantToPlay, error: wantToPlayError } = await useLazyFetch(
  "/api/games/details",
  {
    params: {
      id: `(${wantToPlayData
        .slice(0, 5)
        .map((data) => data.game_id)
        .join(",")})`,
      limit: 5,
    },
  },
);
</script>

<template>
  <h1 class="sr-only">{{ config.public.APP_NAME }}</h1>

  <div class="flex flex-col gap-4">
    <section>
      <GameHomeSlider :games="featuredGames" />
    </section>

    <section class="my-2">
      <div class="flex flex-col gap-2">
        <div>
          <h2 class="heading-2">Upcoming Games</h2>
        </div>

        <div
          class="grid grid-cols-2 gap-2 md:grid-cols-4 xl:flex xl:overflow-x-auto"
        >
          <GameExpandableCard :games="upcomingGames" />
        </div>
      </div>
    </section>

    <section v-if="popularGames" class="my-2">
      <GameSlider
        id="popularGames"
        :games="popularGames"
        title="Popular Right Now"
        description="Popular Games of The Week"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="mostAnticipated"
        :games="mostAnticipated"
        title="Most Anticipated"
        :slides-per-view="2"
        :slides-per-group="2"
        :breakpoints="{
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="newReleases"
        :games="newReleases"
        title="New Releases"
        :slides-per-view="2"
        :slides-per-group="2"
        :breakpoints="{
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
      />
    </section>

    <section class="my-2 lg:my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile class="w-full" :games="mostPlayed" title="Most Played" />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile class="w-full" :games="playing" title="Playing" />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile class="w-full" :games="wantToPlay" title="Want to Play" />
      </div>
    </section>

    <section class="my-2">
      <GameSlider id="indie" :games="indie" title="Indie" />
    </section>

    <section class="my-2">
      <GameSlider id="shooter" :games="shooter" title="Shooter" />
    </section>

    <section class="my-2">
      <GameSlider id="racing" :games="racing" title="Racing" />
    </section>

    <section class="my-2">
      <GameSlider
        id="sports"
        :games="sports"
        title="Sports"
        :slides-per-view="2"
        :slides-per-group="2"
        :space-between="16"
        :breakpoints="{
          640: {
            slidesPerGroup: 2,
            slidesPerView: 2,
          },
        }"
        :isHorizontal="true"
      />
    </section>
  </div>
</template>
