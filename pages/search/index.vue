<script setup>
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

useSeoMeta({
  title: `Search`,
  description: `Search for your favorite games`,
  ogTitle: `Search - ${config.public.APP_NAME}`,
  ogDescription: `Search for your favorite games`,
  twitterTitle: `Search - ${config.public.APP_NAME}`,
  twitterDescription: `Search for your favorite games`,
});

// State
const loadMoreRef = ref();
const games = ref([]);
const showFilter = useShowFilter();
const isFinished = ref(false);

// Computed
const isQueryParams = computed(() =>
  Object.keys(route.query).includes("query"),
);
const isCompanyParams = computed(() =>
  Object.keys(route.query).includes("company"),
);
const isThereAnyFilter = computed(
  () => Object.keys(route.query).filter((key) => key !== "query").length > 0,
);
const getKey = computed(() => {
  const params = new URLSearchParams({
    ...route.query,
    offset: games.value.length,
  }).toString();

  return `/api/games/search?${params}`;
});

// Functions
const handleClearFilters = () =>
  isQueryParams.value
    ? router.push({ path: "/search", query: { query: route.query.query } })
    : router.push({ path: "/search" });
const setShowFilter = () => (showFilter.value = !showFilter.value);

// Fetcher
const { data: multiquery } = await useFetch("/api/search/multiquery", {
  transform: (payload) => {
    return {
      results: payload,
      fetchedAt: new Date(),
    };
  },
  getCachedData: (key, nuxtApp) => {
    const data = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
    if (!data) return;

    const expiration = new Date(data.fetchedAt);
    expiration.setTime(expiration.getTime() + 30 * 60 * 1000);

    const isExpired = expiration.getTime() < Date.now();

    if (isExpired) return;

    return data;
  },
});

const fetchGames = async (key) => {
  const { data } = await useAsyncData(key, () => $fetch(key), {
    transform: (payload) => {
      if (payload.length < 1) {
        isFinished.value = true;
      }

      const combinedGames = [...games.value, ...payload];
      const uniqueGames = combinedGames.filter(
        (game, index, self) =>
          index === self.findIndex((t) => t.id === game.id),
      );

      return {
        results: uniqueGames,
        fetchedAt: new Date(),
      };
    },
    getCachedData: (key, nuxtApp) => {
      const data = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      if (!data) return;

      const expiration = new Date(data.fetchedAt);
      expiration.setTime(expiration.getTime() + 30 * 60 * 1000);

      const isExpired = expiration.getTime() < Date.now();

      if (isExpired) return;

      return data;
    },
  });

  games.value = data.value.results;
};

// Lifecycle
onMounted(() => {
  watch(
    () => route.query,
    async () => {
      window.scrollTo({ top: 0 });

      games.value = [];
      isFinished.value = false;

      await fetchGames(getKey.value);
    },
    { immediate: true },
  );
});

useInfiniteScroll(
  loadMoreRef,
  async () => {
    await fetchGames(getKey.value);
    await new Promise((resolve) => setTimeout(resolve, 5e2));
  },
  { distance: 10 },
);
</script>

<template>
  <div class="-mx-4 flex">
    <h1 class="sr-only">Search</h1>

    <!-- Filters -->
    <div
      class="fixed inset-0 top-[72px] z-[100] mt-1 h-screen max-h-[calc(100dvh-72px)] transition-all duration-300 lg:sticky lg:h-auto lg:max-h-none lg:min-w-[315px] lg:max-w-[315px] lg:pl-4"
      :class="{
        '-translate-x-[calc(100%+1rem)]': !showFilter,
        'translate-x-0': showFilter,
      }"
    >
      <SearchFilter :multiquery="multiquery.results" />

      <button @click="setShowFilter" class="absolute right-4 top-2 lg:hidden">
        <Icon name="ion:close" size="28" />
      </button>
    </div>

    <!-- Top -->
    <div
      class="flex w-full flex-col transition-all duration-300"
      :class="{
        'lg:-ml-[315px]': !showFilter,
      }"
    >
      <section
        class="sticky top-[72px] z-[99] flex w-full flex-row items-center gap-3 bg-base-100 bg-opacity-90 p-4 backdrop-blur lg:py-2"
      >
        <!-- Search Bar for Mobile -->
        <SearchBar
          :class="{
            'sm:hidden': route.path === '/search',
          }"
        />

        <!-- Sort -->
        <div class="flex items-center gap-2 sm:w-full">
          <div class="flex items-center gap-2 sm:h-[41px] sm:flex-row-reverse">
            <button
              v-if="isThereAnyFilter"
              @click="handleClearFilters"
              class="btn btn-square btn-outline btn-error sm:btn-sm sm:h-full sm:w-fit sm:px-4"
            >
              <Icon name="ion:close" size="20" />
              <span class="hidden sm:block">Reset</span>
            </button>

            <button
              @click="setShowFilter"
              class="btn btn-square btn-secondary aspect-square sm:btn-sm sm:h-full sm:w-fit sm:px-0"
            >
              <!-- <span class="hidden sm:block">Filters</span> -->
              <Icon name="ion:options" size="20" />
            </button>
          </div>

          <div class="ml-auto hidden items-center gap-2 sm:flex">
            <div
              v-show="games?.length > 0"
              class="hidden text-xs font-medium md:block"
            >
              <span>Showing {{ games.length }} Games</span>
            </div>

            <SearchSort class="hidden sm:flex" />
          </div>
        </div>
      </section>

      <!-- Results -->
      <section class="px-4 pt-2 @container">
        <GameGrid :games="games">
          <template v-if="!isFinished && !isCompanyParams">
            <span
              ref="loadMoreRef"
              class="aspect-poster animate-pulse rounded-xl bg-gray-400 bg-opacity-20"
            ></span>
            <span
              v-for="i in 19"
              :key="i"
              class="aspect-poster animate-pulse rounded-xl bg-gray-400 bg-opacity-20"
            ></span>
          </template>
        </GameGrid>

        <div v-show="isFinished && games.length < 1" class="flex justify-start">
          <span class="">No game found</span>
        </div>
      </section>
    </div>
  </div>
</template>
