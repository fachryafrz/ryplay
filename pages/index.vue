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
const popularityData = multiqueryResponse.value.find(
  (res) => res.name === "popularity-data",
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
const ubisoft = multiqueryResponse.value.find((res) => res.name === "ubisoft")
  .result[0].developed;
const rockstarGames = multiqueryResponse.value.find(
  (res) => res.name === "rockstar-games",
).result[0].developed;
const electronicArts = multiqueryResponse.value.find(
  (res) => res.name === "electronic-arts",
).result[0].developed;

const { data: popularGames, error: gamesError } = await useFetch(
  "/api/games/details",
  {
    params: {
      id: `(${popularityData.map((data) => data.game_id).join(",")})`,
      sort: `hypes desc`,
      limit: 20,
    },
  },
);

if (gamesError.value) throw gamesError.value;
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

    <section class="my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile class="w-full" :games="indie" title="Indie" />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile class="w-full" :games="shooter" title="Shooter" />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile class="w-full" :games="racing" title="Racing" />
      </div>
    </section>

    <section class="my-2">
      <GameSlider id="ubisoft" :games="ubisoft.slice(0, 20)" title="Ubisoft" />
    </section>

    <section class="my-2">
      <GameSlider
        id="rockstarGames"
        :games="rockstarGames.slice(0, 20)"
        title="Rockstar Games"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="electronicArts"
        :games="electronicArts.slice(0, 20)"
        title="Electronic Arts"
      />
    </section>

    <section class="my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile class="w-full" :games="indie" title="Retro" />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile class="w-full" :games="indie" title="Virtual Reality" />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile class="w-full" :games="indie" title="Puzzle" />
      </div>
    </section>

    <section class="my-2">
      <GameSlider
        id="sports"
        :games="featuredGames"
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

    <section class="my-2">
      <GameSlider id="survival" :games="topRatedGames" title="Survival" />
    </section>

    <section class="my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile class="w-full" :games="indie" title="Adventure" />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile class="w-full" :games="indie" title="Open World" />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile class="w-full" :games="indie" title="Fighting" />
      </div>
    </section>

    <section class="my-2">
      <GameSlider id="platformer" :games="topRatedGames" title="Platformer" />
    </section>

    <section class="my-2">
      <GameSlider id="simulation" :games="topRatedGames" title="Simulation" />
    </section>

    <section class="my-2">
      <GameSlider id="horror" :games="topRatedGames" title="Horror" />
    </section>

    <section class="my-2">
      <GameSlider
        id="rpg"
        :games="featuredGames"
        title="Role-Playing Games"
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
  </div>
</template>
