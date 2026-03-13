<script setup>
import { ref, reactive } from "vue";
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

// --- CONFIG ---
const sectionsConfig = [
  {
    id: "upcoming",
    title: "Upcoming Games",
    endpoint: "/api/upcoming",
    seeAll: `/search?release_date=${today}..${endOfNextYear}&hypes=50&sort=first_release_date+asc`,
    showByDefault: true,
    onlyExpandable: true,
  },
  {
    id: "topRated",
    title: "Top Rated",
    description: "Most Popular Games of All Time",
    endpoint: "/api/top-rated",
    seeAll: `/search?sort=total_rating_count+desc`,
  },
  {
    id: "mostAnticipated",
    title: "Most Anticipated",
    endpoint: "/api/most-anticipated",
    desktopSeeAll: null,
    seeAll: `/search?limit=20&sort=hypes+desc&category=0&release_date=${today}..${endOfNextYear}&hypes=40`,
    isHorizontal: true,
    slidesPerGroup: 1,
    breakpoints: {
      768: { slidesPerGroup: 2, slidesPerView: 2 },
      1024: { slidesPerGroup: 3, slidesPerView: 3 },
    },
  },
  {
    id: "newReleases",
    title: "New Releases",
    endpoint: "/api/games/home-sections/new-releases",
    desktopSeeAll: `/search?sort=first_release_date+desc&category=0&hypes=100&release_date=${oneMonthAgo}..${today}`,
    seeAll: `/search?limit=20&sort=first_release_date+desc&category=0&hypes=10&release_date=${oneMonthAgo}..${today}`,
    isHorizontal: true,
    slidesPerGroup: 1,
    breakpoints: {
      768: { slidesPerGroup: 2, slidesPerView: 2 },
      1024: { slidesPerGroup: 3, slidesPerView: 3 },
    },
  },
  {
    id: "adventure",
    title: "Adventure",
    endpoint: "/api/games/home-sections/adventure",
    seeAll: `/search?genre=adventure`,
  },
  {
    id: "hack-and-slash-beat-em-up",
    title: "Hack and Slash Beat 'Em Up",
    endpoint: "/api/games/home-sections/hack-slash",
    seeAll: `/search?genre=hack-and-slash-beat-em-up`,
  },
  {
    id: "racing",
    title: "Racing",
    endpoint: "/api/games/home-sections/racing",
    seeAll: `/search?genre=racing`,
  },
];

// --- STATES & QUERIES ---
const sections = sectionsConfig.map((config) => {
  const show = ref(config.showByDefault || false);
  const target = ref(null);

  if (!config.showByDefault) {
    useIntersectionObserver(target, ([{ isIntersecting }]) => {
      if (isIntersecting) show.value = true;
    });
  }

  const { data, isLoading } = useSWRV(
    () => (show.value ? config.endpoint : null),
    fetcher,
    { dedupingInterval: 3600000, revalidateOnFocus: false },
  );

  return reactive({
    ...config,
    show,
    target,
    data,
    isLoading,
  });
});
</script>

<template>
  <div class="contents">
    <template v-for="section in sections" :key="section.id">
      <div
        v-if="!section.showByDefault"
        :ref="(el) => { if (el) section.target = el; }"
        class="h-1 w-full"
      />

      <section :class="['my-2', !section.onlyExpandable ? 'hidden xl:block' : '']">
        <div class="flex flex-col gap-2">
          <div v-if="section.description">
            <NuxtLink
              v-if="section.desktopSeeAll !== null"
              :prefetch="false"
              :to="section.desktopSeeAll || section.seeAll"
              class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
            >
              <h2 class="heading-2">{{ section.title }}</h2>
              <Icon
                name="ion:ios-arrow-forward"
                class="transition-all sm:size-6"
              />
            </NuxtLink>
            <h2 v-else class="heading-2">{{ section.title }}</h2>
            <p class="text-sm text-neutral-500">{{ section.description }}</p>
          </div>

          <template v-else>
            <NuxtLink
              v-if="section.desktopSeeAll !== null"
              :prefetch="false"
              :to="section.desktopSeeAll || section.seeAll"
              class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
            >
              <h2 class="heading-2">{{ section.title }}</h2>
              <Icon
                name="ion:ios-arrow-forward"
                class="transition-all sm:size-6"
              />
            </NuxtLink>
            <h2 v-else class="heading-2">{{ section.title }}</h2>
          </template>

          <SkeletonSlider v-if="!section.show || section.isLoading || !section.data" />
          <GameExpandableCard v-else :games="section.data" />
        </div>
      </section>

      <section v-if="!section.onlyExpandable" class="my-2 xl:hidden">
        <SkeletonSlider
          v-if="!section.show || section.isLoading || !section.data"
          :isHorizontal="!!section.isHorizontal"
        />

        <GameSlider
          v-else
          :id="section.id"
          :games="section.data"
          :title="section.title"
          :description="section.description"
          :see-all="section.seeAll"
          :slides-per-group="section.slidesPerGroup"
          :breakpoints="section.breakpoints"
          :isHorizontal="!!section.isHorizontal"
        />
      </section>
    </template>
  </div>
</template>
