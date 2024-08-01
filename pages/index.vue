<script setup>
const config = useRuntimeConfig();
const router = useRouter();

const dayjs = useDayjs();
const today = dayjs().unix();

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
const adventure = multiqueryResponse.value.find(
  (res) => res.name === "adventure",
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

const groupedPopularityData = popularityData
  .map((data) => data.game_id)
  .join(",");
const groupedMostPlayedData = mostPlayedData
  .map((data) => data.game_id)
  .join(",");
const groupedPlayingData = playingData.map((data) => data.game_id).join(",");
const groupedWantToPlayData = wantToPlayData
  .map((data) => data.game_id)
  .join(",");

const {
  data: popularGames,
  error: popularGamesError,
  execute: fetchPopularGames,
  status: statusPopularGames,
} = useLazyFetch("/api/games/details", {
  params: {
    id: `${groupedPopularityData}`,
    sort: `hypes desc`,
    limit: 20,
  },
  immediate: false,
});
const {
  data: mostPlayed,
  error: mostPlayedError,
  execute: fetchMostPlayed,
  status: statusMostPlayed,
} = useLazyFetch("/api/games/details", {
  params: {
    id: `${groupedMostPlayedData}`,
    sort: `first_release_date desc`,
    limit: 10,
  },
  immediate: false,
});
const {
  data: playing,
  error: playingError,
  execute: fetchPlaying,
  status: statusPlaying,
} = useLazyFetch("/api/games/details", {
  params: {
    id: `${groupedPlayingData}`,
    sort: `first_release_date desc`,
    limit: 10,
  },
  immediate: false,
});
const {
  data: wantToPlay,
  error: wantToPlayError,
  execute: fetchWantToPlay,
  status: statusWantToPlay,
} = useLazyFetch("/api/games/details", {
  params: {
    id: `${groupedWantToPlayData}`,
    sort: `first_release_date desc`,
    limit: 10,
  },
  immediate: false,
});

onMounted(() => {
  fetchPopularGames();
  fetchMostPlayed();
  fetchPlaying();
  fetchWantToPlay();
});
</script>

<template>
  <h1 class="sr-only">{{ config.public.APP_NAME }}</h1>

  <div class="flex flex-col gap-4">
    <section>
      <GameHomeSlider :games="featuredGames" />
    </section>

    <section class="my-2">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :to="`/search?limit=20&sort=first_release_date+asc&release_date=${today}&hypes=30&category=0`"
          class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
        >
          <h2 class="heading-2">Upcoming Games</h2>
          <Icon name="ion:ios-arrow-forward" size="25" class="transition-all" />
        </NuxtLink>

        <div
          class="grid grid-cols-2 gap-2 md:grid-cols-4 xl:flex xl:overflow-x-auto"
        >
          <GameExpandableCard :games="upcomingGames" />
        </div>
      </div>
    </section>

    <section class="my-2">
      <div
        v-show="statusPopularGames === `pending`"
        class="flex justify-center"
      >
        <span class="loading loading-spinner"></span>
      </div>

      <GameSlider
        v-show="statusPopularGames === `success`"
        id="popularGames"
        :games="popularGames"
        title="Popular Right Now"
        description="Popular Games of The Week"
        :see-all="`/search?limit=20&sort=hypes+desc&id=${groupedPopularityData}`"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
        :see-all="`/search?limit=20&sort=total_rating_count+desc&category=0`"
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
        :see-all="`/search?limit=20&sort=hypes+desc&category=0&release_date=${today}&hypes=40&screenshots=true&artworks=true`"
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
        :see-all="`/search?limit=20&sort=first_release_date+desc&category=0&hypes=10&release_date=..${today}`"
      />
    </section>

    <section class="my-2 lg:my-8">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div
          v-show="statusMostPlayed === `pending`"
          class="flex h-fit justify-center"
        >
          <span class="loading loading-spinner"></span>
        </div>

        <GameTile
          v-show="statusMostPlayed === `success`"
          class="w-full"
          :games="mostPlayed?.slice(0, 5)"
          title="Most Played"
          :see-all="`/search?limit=20&sort=first_release_date+desc&id=${groupedMostPlayedData}`"
        />

        <div class="lg:flex lg:justify-center">
          <span class="divider flex-shrink lg:divider-horizontal"></span>
        </div>

        <div
          v-show="statusPlaying === `pending`"
          class="flex h-fit justify-center"
        >
          <span class="loading loading-spinner"></span>
        </div>

        <GameTile
          v-show="statusPlaying === `success`"
          class="w-full"
          :games="playing?.slice(0, 5)"
          title="Playing"
          :see-all="`/search?limit=20&sort=first_release_date+desc&id=${groupedPlayingData}`"
        />

        <div class="lg:flex lg:justify-center">
          <span class="divider flex-shrink lg:divider-horizontal"></span>
        </div>

        <div
          v-show="statusWantToPlay === `pending`"
          class="flex h-fit justify-center"
        >
          <span class="loading loading-spinner"></span>
        </div>

        <GameTile
          v-show="statusWantToPlay === `success`"
          class="w-full"
          :games="wantToPlay?.slice(0, 5)"
          title="Want to Play"
          :see-all="`/search?limit=20&sort=first_release_date+desc&id=${groupedWantToPlayData}`"
        />
      </div>
    </section>

    <section class="my-2">
      <GameSlider
        id="adventure"
        :games="adventure"
        title="Adventure"
        :see-all="`/search?limit=20&sort=total_rating_count+desc&genres=31&screenshots=true&artworks=true&category=0`"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="shooter"
        :games="shooter"
        title="Shooter"
        :see-all="`/search?limit=20&sort=total_rating_count+desc&genres=5&screenshots=true&artworks=true&category=0`"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="racing"
        :games="racing"
        title="Racing"
        :see-all="`/search?limit=20&sort=total_rating_count+desc&genres=10&screenshots=true&artworks=true&category=0`"
      />
    </section>

    <section class="my-2 lg:my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile
          class="w-full"
          :games="mostPlayed?.slice(5, 10)"
          title="Most Played"
          :see-all="`/search?limit=20&sort=first_release_date+desc&id=${groupedMostPlayedData}`"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="playing?.slice(5, 10)"
          title="Playing"
          :see-all="`/search?limit=20&sort=first_release_date+desc&id=${groupedPlayingData}`"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="wantToPlay?.slice(5, 10)"
          title="Want to Play"
          :see-all="`/search?limit=20&sort=first_release_date+desc&id=${groupedWantToPlayData}`"
        />
      </div>
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
        :see-all="`/search?limit=20&sort=total_rating_count+desc&genres=14&screenshots=true&artworks=true&category=0`"
      />
    </section>
  </div>
</template>
