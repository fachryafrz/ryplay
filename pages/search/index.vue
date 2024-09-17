<script setup>
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const loadMoreRef = ref();
const games = ref([]);
const offset = ref(0);
const showFilter = ref(false);
const isLoading = ref(true);
const isFinished = ref(false);

const isThereAnyFilter = computed(() => {
  return Object.keys(route.query).length > 0;
});

const handleClearFilters = () => {
  router.push({ path: "/search" });
};

const setShowFilter = () => {
  showFilter.value = !showFilter.value;
};

const { data: multiquery } = await useFetch("/api/search/multiquery");

const { execute: fetchGames, error } = await useAsyncData(
  () =>
    $fetch("/api/games/search", {
      params: {
        ...route.query,
        offset: offset.value,
      },
      onResponse: ({ response: { _data: data } }) => {
        isLoading.value = false;
        isFinished.value = false;

        const combinedGames = [...games.value, ...data];

        const uniqueGames = combinedGames.filter(
          (game, index, self) =>
            index === self.findIndex((t) => t.id === game.id),
        );

        if (uniqueGames.length === games.value.length) {
          isFinished.value = true;
        }

        games.value = uniqueGames;
      },
    }),
  { immediate: false },
);

useSeoMeta({
  title: `Search`,
  description: `Search for your favorite games`,
  ogTitle: `Search - ${config.public.APP_NAME}`,
  ogDescription: `Search for your favorite games`,
  twitterTitle: `Search - ${config.public.APP_NAME}`,
  twitterDescription: `Search for your favorite games`,
});

watch(
  () => route.query,
  async () => {
    offset.value = 0;
    games.value = [];
    isLoading.value = true;
    await fetchGames();
  },
  { immediate: true },
);

useInfiniteScroll(
  loadMoreRef,
  async () => {
    offset.value += 20;
    await fetchGames();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  // { distance: 100 },
);
</script>

<template>
  <div class="-mx-4 flex">
    <h1 class="sr-only">Search</h1>

    <!-- Filters -->
    <div
      class="fixed inset-0 top-[72px] z-[100] mt-1 h-screen max-h-[calc(100dvh-72px)] transition-all lg:static lg:h-auto lg:max-h-none lg:min-w-[315px] lg:max-w-[315px] lg:pl-4"
      :class="{
        '-translate-x-full lg:translate-x-0': !showFilter,
        'translate-x-0': showFilter,
      }"
    >
      <SearchFilter :multiquery="multiquery" />

      <button @click="setShowFilter" class="absolute right-4 top-2 lg:hidden">
        <Icon name="ion:close" size="28" />
      </button>
    </div>

    <!-- Top -->
    <div class="flex w-full flex-col">
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
          <div class="flex items-center gap-2 sm:h-[41px]">
            <button
              v-if="isThereAnyFilter"
              @click="handleClearFilters"
              class="btn btn-square btn-outline btn-error sm:btn-sm sm:h-full sm:w-fit sm:px-4"
            >
              <Icon name="ion:close" size="20" />
              <span class="hidden sm:block">Clear</span>
            </button>

            <button
              @click="setShowFilter"
              class="btn btn-square btn-secondary sm:btn-sm sm:h-full sm:w-fit sm:px-4 lg:hidden"
            >
              <span class="hidden sm:block">Filters</span>
              <Icon name="ion:filter" size="20" />
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
      <section class="p-4 py-2 @container">
        <div
          v-show="isLoading"
          class="grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7"
        >
          <span
            v-for="i in 20"
            class="aspect-poster animate-pulse rounded-xl bg-gray-400 bg-opacity-20"
          ></span>
        </div>

        <GameGrid v-show="!isLoading && games.length > 0" :games="games" />

        <div
          v-show="!isLoading && games.length < 1"
          class="flex justify-start px-4"
        >
          <span class="">No game found</span>
        </div>

        <button
          ref="loadMoreRef"
          v-show="!isLoading && games.length >= 20 && !isFinished"
          class="pointer-events-none mx-auto mt-4 flex aspect-square"
        >
          <span class="loading loading-spinner"></span>
        </button>
      </section>
    </div>
  </div>
</template>
