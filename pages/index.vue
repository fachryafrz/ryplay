<script setup>
const appConfig = useAppConfig();
const router = useRouter();
const dayjs = useDayjs();
const today = dayjs().unix();
const endOfNextYear = dayjs().add(1, "year").endOf("year").unix();
const oneMonthAgo = dayjs().add(-1, "month").unix();

const { data: home, status: statusHome } = await useFetch("/api/home");

// Yang lain pakai CSR
const { data: homeMore, status: statusHomeMore } = useFetch("/api/home-more", {
  server: false,
  lazy: true,
});
const { data: multiquery, status: statusMultiquery } = useFetch(
  "/api/multiquery",
  { server: false, lazy: true },
);

const featured = computed(
  () => home.value?.find((res) => res.name === "featured").result,
);
const upcoming = computed(
  () => home.value?.find((res) => res.name === "upcoming").result,
);
const topRated = computed(
  () => home.value?.find((res) => res.name === "top-rated").result,
);
const mostAnticipated = computed(
  () => home.value?.find((res) => res.name === "most-anticipated").result,
);
const newReleases = computed(
  () => homeMore.value?.find((res) => res.name === "new-releases").result,
);
const adventure = computed(
  () => homeMore.value?.find((res) => res.name === "adventure").result,
);
const hackAndSlashBeatEmUp = computed(
  () =>
    homeMore.value?.find((res) => res.name === "hack-and-slash-beat-em-up")
      .result,
);
const racing = computed(
  () => homeMore.value?.find((res) => res.name === "racing").result,
);

const popular = computed(() => multiquery.value?.popular);
const mostPlayed = computed(() => multiquery.value?.mostPlayed);
const playing = computed(() => multiquery.value?.playing);
const wantToPlay = computed(() => multiquery.value?.wantToPlay);
</script>

<template>
  <h1 class="sr-only">{{ appConfig.name }}</h1>

  <div
    v-if="statusHome !== 'success'"
    class="grid h-[calc(100dvh-72px-193px)] place-content-center md:h-[calc(100dvh-72px-120px)]"
  >
    <Logo width="50" height="50" class="animate-ping" />
  </div>

  <div v-if="statusHome === 'success'" class="mx-auto flex flex-col gap-4">
    <section>
      <GameHomeSlider :games="featured" />
    </section>

    <section class="my-2">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Upcoming Games</h2>

        <div
          class="grid grid-cols-2 gap-2 overflow-auto md:grid-cols-4 lg:flex"
        >
          <GameExpandableCard :games="upcoming" />
        </div>
      </div>
    </section>

    <section class="my-2">
      <!-- <div
        v-show="statusMultiquery !== `success`"
        class="flex items-center justify-center gap-2"
      >
        <span class="loading loading-spinner"></span>
      </div> -->

      <SkeletonSlider v-show="statusMultiquery !== `success`" />

      <GameSlider
        v-show="statusMultiquery === `success`"
        id="popular"
        :games="popular"
        title="Popular Right Now"
        description="Popular Games of The Week"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRated"
        :games="topRated"
        title="Top Rated"
        description="Most Popular Games of All Time"
        :see-all="`/search?sort=total_rating_count+desc`"
      />
    </section>

    <section class="my-2">
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

    <section class="my-2">
      <SkeletonSlider v-show="statusHomeMore !== `success`" />

      <GameSlider
        v-show="statusHomeMore === `success`"
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

    <SkeletonTile v-show="statusMultiquery !== `success`" />

    <section class="my-2 lg:my-8" v-if="statusMultiquery === `success`">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <GameTile
          class="w-full"
          :games="mostPlayed?.slice(0, 5)"
          title="Most Played"
        />

        <div class="lg:flex lg:justify-center">
          <span class="divider flex-shrink lg:divider-horizontal"></span>
        </div>

        <GameTile
          class="w-full"
          :games="playing?.slice(0, 5)"
          title="Playing"
        />

        <div class="lg:flex lg:justify-center">
          <span class="divider flex-shrink lg:divider-horizontal"></span>
        </div>

        <GameTile
          class="w-full"
          :games="wantToPlay?.slice(0, 5)"
          title="Want to Play"
        />
      </div>
    </section>

    <section class="my-2">
      <SkeletonSlider v-show="statusHomeMore !== `success`" />

      <GameSlider
        v-show="statusHomeMore === `success`"
        id="adventure"
        :games="adventure"
        title="Adventure"
        :see-all="`/search?genre=adventure`"
      />
    </section>

    <section class="my-2">
      <SkeletonSlider v-show="statusHomeMore !== `success`" />

      <GameSlider
        v-show="statusHomeMore === `success`"
        id="hack-and-slash-beat-em-up"
        :games="hackAndSlashBeatEmUp"
        title="Hack and Slash Beat 'Em Up"
        :see-all="`/search?genre=hack-and-slash-beat-em-up`"
      />
    </section>

    <section class="my-2">
      <SkeletonSlider v-show="statusHomeMore !== `success`" />

      <GameSlider
        v-show="statusHomeMore === `success`"
        id="racing"
        :games="racing"
        title="Racing"
        :see-all="`/search?genre=racing`"
      />
    </section>

    <SkeletonTile v-show="statusMultiquery !== `success`" />

    <section class="my-2 lg:my-8" v-if="statusMultiquery === `success`">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <GameTile
          class="w-full"
          :games="mostPlayed?.slice(5)"
          title="Most Played"
        />

        <div class="lg:flex lg:justify-center">
          <span class="divider flex-shrink lg:divider-horizontal"></span>
        </div>

        <GameTile class="w-full" :games="playing?.slice(5)" title="Playing" />

        <div class="lg:flex lg:justify-center">
          <span class="divider flex-shrink lg:divider-horizontal"></span>
        </div>

        <GameTile
          class="w-full"
          :games="wantToPlay?.slice(5)"
          title="Want to Play"
        />
      </div>
    </section>
  </div>
</template>
