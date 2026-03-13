<script setup>
import axios from "axios";
import useSWRV from "swrv";
import { useIntersectionObserver } from "@vueuse/core";

const dayjs = useDayjs();
const today = dayjs().unix();
const endOfNextYear = dayjs().add(1, "year").endOf("year").unix();
const oneMonthAgo = dayjs().add(-1, "month").unix();

const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

// --- STATES ---
const showUpcoming = ref(true); // First section visible by default
const showTopRated = ref(false);
const showMostAnticipated = ref(false);
const showNewReleases = ref(false);
const showAdventure = ref(false);
const showHackSlash = ref(false);
const showRacing = ref(false);

const topRatedTarget = ref(null);
const mostAnticipatedTarget = ref(null);
const newReleasesTarget = ref(null);
const adventureTarget = ref(null);
const hackSlashTarget = ref(null);
const racingTarget = ref(null);

useIntersectionObserver(
  topRatedTarget,
  ([{ isIntersecting }]) => {
    if (isIntersecting) showTopRated.value = true;
  },
);

useIntersectionObserver(
  mostAnticipatedTarget,
  ([{ isIntersecting }]) => {
    if (isIntersecting) showMostAnticipated.value = true;
  },
);

useIntersectionObserver(
  newReleasesTarget,
  ([{ isIntersecting }]) => {
    if (isIntersecting) showNewReleases.value = true;
  },
);

useIntersectionObserver(
  adventureTarget,
  ([{ isIntersecting }]) => {
    if (isIntersecting) showAdventure.value = true;
  },
);

useIntersectionObserver(
  hackSlashTarget,
  ([{ isIntersecting }]) => {
    if (isIntersecting) showHackSlash.value = true;
  },
);

useIntersectionObserver(
  racingTarget,
  ([{ isIntersecting }]) => {
    if (isIntersecting) showRacing.value = true;
  },
);

// --- QUERIES ---
const { data: upcomingData, isLoading: loadingUpcoming } = useSWRV(
  () => showUpcoming.value ? "/api/upcoming" : null,
  fetcher,
  { dedupingInterval: 3600000, revalidateOnFocus: false }
);
const upcoming = computed(() => upcomingData.value?.find((res) => res.name === "upcoming")?.result);

const { data: topRatedData, isLoading: loadingTopRated } = useSWRV(
  () => showTopRated.value ? "/api/top-rated" : null,
  fetcher,
  { dedupingInterval: 3600000, revalidateOnFocus: false }
);
const topRated = computed(() => topRatedData.value?.find((res) => res.name === "top-rated")?.result);

const { data: mostAnticipatedData, isLoading: loadingMostAnticipated } = useSWRV(
  () => showMostAnticipated.value ? "/api/most-anticipated" : null,
  fetcher,
  { dedupingInterval: 3600000, revalidateOnFocus: false }
);
const mostAnticipated = computed(() => mostAnticipatedData.value?.find((res) => res.name === "most-anticipated")?.result);

const { data: newReleases, isLoading: loadingNewReleases } = useSWRV(
  () => showNewReleases.value ? "/api/games/home-sections/new-releases" : null,
  fetcher,
  { dedupingInterval: 3600000, revalidateOnFocus: false }
);

const { data: adventure, isLoading: loadingAdventure } = useSWRV(
  () => showAdventure.value ? "/api/games/home-sections/adventure" : null,
  fetcher,
  { dedupingInterval: 3600000, revalidateOnFocus: false }
);

const { data: hackAndSlashBeatEmUp, isLoading: loadingHackSlash } = useSWRV(
  () => showHackSlash.value ? "/api/games/home-sections/hack-slash" : null,
  fetcher,
  { dedupingInterval: 3600000, revalidateOnFocus: false }
);

const { data: racing, isLoading: loadingRacing } = useSWRV(
  () => showRacing.value ? "/api/games/home-sections/racing" : null,
  fetcher,
  { dedupingInterval: 3600000, revalidateOnFocus: false }
);
</script>

<template>
  <div class="contents">
    <section class="my-2">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :prefetch="false"
          :to="`/search?release_date=${today}..${endOfNextYear}&hypes=50&sort=first_release_date+asc`"
          class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
        >
          <h2 class="heading-2">Upcoming Games</h2>
          <Icon name="ion:ios-arrow-forward" class="transition-all sm:size-6" />
        </NuxtLink>

        <SkeletonSlider v-if="!showUpcoming || loadingUpcoming || !upcoming" />
        <GameExpandableCard v-else :games="upcoming" />
      </div>
    </section>

    <div ref="topRatedTarget" class="h-1 w-full" />

    <section class="my-2 hidden xl:block">
      <div class="flex flex-col gap-2">
        <div>
          <NuxtLink
            :prefetch="false"
            :to="`/search?sort=total_rating_count+desc`"
            class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
          >
            <h2 class="heading-2">Top Rated</h2>
            <Icon
              name="ion:ios-arrow-forward"
              class="transition-all sm:size-6"
            />
          </NuxtLink>
          <p class="text-sm text-neutral-500">Most Popular Games of All Time</p>
        </div>

        <SkeletonSlider v-if="!showTopRated || loadingTopRated || !topRated" />
        <GameExpandableCard v-else :games="topRated" />
      </div>
    </section>

    <section class="my-2 xl:hidden">
      <SkeletonSlider v-if="!showTopRated || loadingTopRated || !topRated" />
      <GameSlider
        v-else
        id="topRated"
        :games="topRated"
        title="Top Rated"
        description="Most Popular Games of All Time"
        :see-all="`/search?sort=total_rating_count+desc`"
      />
    </section>

    <div ref="mostAnticipatedTarget" class="h-1 w-full" />

    <section class="my-2 hidden xl:block">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Most Anticipated</h2>

        <SkeletonSlider v-if="!showMostAnticipated || loadingMostAnticipated || !mostAnticipated" />
        <GameExpandableCard v-else :games="mostAnticipated" />
      </div>
    </section>

    <section class="my-2 xl:hidden">
      <SkeletonSlider v-if="!showMostAnticipated || loadingMostAnticipated || !mostAnticipated" :isHorizontal="true" />
      <GameSlider
        v-else
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

    <div ref="newReleasesTarget" class="h-1 w-full" />

    <!-- NEW RELEASES -->
    <section class="my-2 hidden xl:block">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :prefetch="false"
          :to="`/search?sort=first_release_date+desc&category=0&hypes=100&release_date=${oneMonthAgo}..${today}`"
          class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
        >
          <h2 class="heading-2">New Releases</h2>
          <Icon name="ion:ios-arrow-forward" class="transition-all sm:size-6" />
        </NuxtLink>

        <SkeletonSlider v-if="!showNewReleases || loadingNewReleases || !newReleases" />
        <GameExpandableCard v-else :games="newReleases" />
      </div>
    </section>

    <section class="my-2 xl:hidden">
      <SkeletonSlider v-if="!showNewReleases || loadingNewReleases || !newReleases" :isHorizontal="true" />

      <GameSlider
        v-else
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

    <div ref="adventureTarget" class="h-1 w-full" />

    <!-- ADVENTURE -->
    <section class="my-2 hidden xl:block">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :prefetch="false"
          :to="`/search?genre=adventure`"
          class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
        >
          <h2 class="heading-2">Adventure</h2>
          <Icon name="ion:ios-arrow-forward" class="transition-all sm:size-6" />
        </NuxtLink>

        <SkeletonSlider v-if="!showAdventure || loadingAdventure || !adventure" />
        <GameExpandableCard v-else :games="adventure" />
      </div>
    </section>

    <section class="my-2 xl:hidden">
      <SkeletonSlider v-if="!showAdventure || loadingAdventure || !adventure" />

      <GameSlider
        v-else
        id="adventure"
        :games="adventure"
        title="Adventure"
        :see-all="`/search?genre=adventure`"
      />
    </section>

    <div ref="hackSlashTarget" class="h-1 w-full" />

    <!-- HACK AND SLASH -->
    <section class="my-2 hidden xl:block">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :prefetch="false"
          :to="`/search?genre=hack-and-slash-beat-em-up`"
          class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
        >
          <h2 class="heading-2">Hack and Slash Beat 'Em Up</h2>
          <Icon name="ion:ios-arrow-forward" class="transition-all sm:size-6" />
        </NuxtLink>

        <SkeletonSlider v-if="!showHackSlash || loadingHackSlash || !hackAndSlashBeatEmUp" />
        <GameExpandableCard v-else :games="hackAndSlashBeatEmUp" />
      </div>
    </section>

    <section class="my-2 xl:hidden">
      <SkeletonSlider v-if="!showHackSlash || loadingHackSlash || !hackAndSlashBeatEmUp" />

      <GameSlider
        v-else
        id="hack-and-slash-beat-em-up"
        :games="hackAndSlashBeatEmUp"
        title="Hack and Slash Beat 'Em Up"
        :see-all="`/search?genre=hack-and-slash-beat-em-up`"
      />
    </section>

    <div ref="racingTarget" class="h-1 w-full" />

    <!-- RACING -->
    <section class="my-2 hidden xl:block">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :prefetch="false"
          :to="`/search?genre=racing`"
          class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
        >
          <h2 class="heading-2">Racing</h2>
          <Icon name="ion:ios-arrow-forward" class="transition-all sm:size-6" />
        </NuxtLink>

        <SkeletonSlider v-if="!showRacing || loadingRacing || !racing" />
        <GameExpandableCard v-else :games="racing" />
      </div>
    </section>

    <section class="my-2 xl:hidden">
      <SkeletonSlider v-if="!showRacing || loadingRacing || !racing" />

      <GameSlider
        v-else
        id="racing"
        :games="racing"
        title="Racing"
        :see-all="`/search?genre=racing`"
      />
    </section>
  </div>
</template>
