<script setup>
const config = useRuntimeConfig();
const router = useRouter();

const dayjs = useDayjs();
const today = dayjs().unix();
const endOfNextYear = dayjs().add(1, "year").endOf("year").unix();
const oneMonthAgo = dayjs().add(-1, "month").unix();

const { data: home, error: homeError } = await useFetch("/api/home");

const featuredGames = home.value.find((res) => res.name === "featured").result;
const upcomingGames = home.value.find((res) => res.name === "upcoming").result;
const topRatedGames = home.value.find((res) => res.name === "top-rated").result;

// Refactored fetch for multiquery
const { data: multiqueryData, status: statusMultiquery } =
  await useLazyFetch("/api/multiquery");

const newReleases = computed(
  () =>
    multiqueryData.value?.find((res) => res.name === "new-releases")?.result ||
    [],
);
const mostAnticipated = computed(
  () =>
    multiqueryData.value?.find((res) => res.name === "most-anticipated")
      ?.result || [],
);
const adventure = computed(
  () =>
    multiqueryData.value?.find((res) => res.name === "adventure")?.result || [],
);
const hackAndSlashBeatEmUp = computed(
  () =>
    multiqueryData.value?.find(
      (res) => res.name === "hack-and-slash-beat-em-up",
    )?.result || [],
);
const racing = computed(
  () =>
    multiqueryData.value?.find((res) => res.name === "racing")?.result || [],
);
const sport = computed(
  () => multiqueryData.value?.find((res) => res.name === "sport")?.result || [],
);

// ============== PopScore ==============
const popularityData = home.value.find(
  (res) => res.name === "popularity-data",
).result;
const mostPlayedData = home.value.find(
  (res) => res.name === "most-played-data",
).result;
const playingData = home.value.find(
  (res) => res.name === "playing-data",
).result;
const wantToPlayData = home.value.find(
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

// Refactored fetch for game details
const fetchGameDetails = (id, sort, limit) => {
  return useLazyFetch("/api/games/details", {
    params: { id, sort, limit },
  });
};

const { data: popularGames, status: statusPopularGames } = fetchGameDetails(
  groupedPopularityData,
  "hypes desc",
  20,
);
const { data: mostPlayed, status: statusMostPlayed } = fetchGameDetails(
  groupedMostPlayedData,
  "first_release_date desc",
  10,
);
const { data: playing, status: statusPlaying } = fetchGameDetails(
  groupedPlayingData,
  "first_release_date desc",
  10,
);
const { data: wantToPlay, status: statusWantToPlay } = fetchGameDetails(
  groupedWantToPlayData,
  "first_release_date desc",
  10,
);
</script>

<template>
  <h1 class="sr-only">{{ config.public.APP_NAME }}</h1>

  <div class="mx-auto flex flex-col gap-4">
    <section>
      <GameHomeSlider :games="featuredGames" />
    </section>

    <section class="my-2">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Upcoming Games</h2>

        <div
          class="grid grid-cols-2 gap-2 md:grid-cols-4 2xl:flex 2xl:overflow-x-auto"
        >
          <GameExpandableCard :games="upcomingGames" />
        </div>
      </div>
    </section>

    <section class="my-2">
      <div
        v-show="statusPopularGames !== `success`"
        class="flex items-center justify-center gap-2"
      >
        <span class="loading loading-spinner"></span>
        <span>Loading popular games...</span>
      </div>

      <GameSlider
        v-show="statusPopularGames === `success`"
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
        :see-all="`/search?sort=total_rating_count+desc`"
      />
    </section>

    <div
      v-show="statusMultiquery === `pending`"
      class="flex items-center justify-center gap-2"
    >
      <span class="loading loading-spinner"></span>
      <span>Loading other stuff...</span>
    </div>

    <section v-show="statusMultiquery === `success`" class="my-2">
      <GameSlider
        id="mostAnticipated"
        :games="mostAnticipated"
        title="Most Anticipated"
        :slides-per-group="1"
        :breakpoints="{
          768: {
            slidesPerGroup: 2,
            slidesPerView: 2,
          },
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
        :see-all="`/search?limit=20&sort=hypes+desc&category=0&release_date=${today}..${endOfNextYear}&hypes=40`"
      />
    </section>

    <section v-show="statusMultiquery === `success`" class="my-2">
      <GameSlider
        id="newReleases"
        :games="newReleases"
        title="New Releases"
        :slides-per-group="1"
        :breakpoints="{
          768: {
            slidesPerGroup: 2,
            slidesPerView: 2,
          },
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
        :see-all="`/search?limit=20&sort=first_release_date+desc&category=0&hypes=10&release_date=${oneMonthAgo}..${today}`"
      />
    </section>

    <section v-show="statusMultiquery === `success`" class="my-2 lg:my-8">
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
        />
      </div>
    </section>

    <section v-show="statusMultiquery === `success`" class="my-2">
      <GameSlider
        id="adventure"
        :games="adventure"
        title="Adventure"
        :see-all="`/search?genre=adventure`"
      />
    </section>

    <section v-show="statusMultiquery === `success`" class="my-2">
      <GameSlider
        id="hack-and-slash-beat-em-up"
        :games="hackAndSlashBeatEmUp"
        title="Hack and Slash Beat 'Em Up"
        :see-all="`/search?genre=hack-and-slash-beat-em-up`"
      />
    </section>

    <section v-show="statusMultiquery === `success`" class="my-2">
      <GameSlider
        id="racing"
        :games="racing"
        title="Racing"
        :see-all="`/search?genre=racing`"
      />
    </section>

    <section v-show="statusMultiquery === `success`" class="my-2 lg:my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile
          class="w-full"
          :games="mostPlayed?.slice(5, 10)"
          title="Most Played"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="playing?.slice(5, 10)"
          title="Playing"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="wantToPlay?.slice(5, 10)"
          title="Want to Play"
        />
      </div>
    </section>

    <section v-show="statusMultiquery === `success`" class="my-2">
      <GameSlider
        id="sport"
        :games="sport"
        title="Sport"
        :slides-per-group="1"
        :breakpoints="{
          768: {
            slidesPerGroup: 2,
            slidesPerView: 2,
          },
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
        :see-all="`/search?genre=sport`"
      />
    </section>
  </div>
</template>
