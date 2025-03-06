<script setup>
import axios from "axios";
import pluralize from "pluralize";
import useSWRV from "swrv";

const { multiquery } = defineProps(["multiquery"]);

const router = useRouter();
const route = useRoute();

// State Management
const showFilter = useShowFilter();
const isFinished = ref(false);
const loadMoreRef = ref(null);
const offset = ref(0);
const limit = 10;

// Computed
const isQueryParams = computed(() => !!route.query.query);
const isCompanyParams = computed(() => !!route.query.company);
const isThereAnyFilter = computed(() => Object.keys(route.query).length > 0);

// Generate Query Key
const getKey = computed(() => {
  const params = new URLSearchParams({
    ...route.query,
  }).toString();
  return `/api/games/search?${params}`;
});

// Fetcher Function
const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

// Functions
const handleClearFilters = () => router.push({ path: "/search" });
const setShowFilter = () => (showFilter.value = !showFilter.value);

// Fetcher
const {
  data: gamesData,
  isValidating,
  isLoading,
} = useSWRV(getKey, () => fetcher(`${getKey.value}&offset=0`), {
  dedupingInterval: Infinity,
  revalidateOnFocus: false,
});

// Process and Deduplicate Games
const games = computed(() => {
  if (!gamesData.value) return [];
  const allGames = gamesData.value || [];
  const uniqueGames = allGames.filter(
    (game, index, self) => index === self.findIndex((t) => t.id === game.id),
  );
  return uniqueGames;
});

// Lifecycle
onMounted(() => {
  watch(
    () => route.query,
    () => {
      window.scrollTo({ top: 0 });
      isFinished.value = false;
    },
    { immediate: true },
  );
});

// Infinite Scroll Logic
const fetchNextPage = async () => {
  if (isFinished.value || isValidating.value) return;

  const nextPageOffset = games.value.length;
  const nextPageKey = `${getKey.value}&offset=${nextPageOffset}`;

  try {
    const nextPageData = await fetcher(nextPageKey);

    if (nextPageData.length < limit) {
      isFinished.value = true;
    }

    gamesData.value.push(...nextPageData);
  } catch (err) {
    console.error("Error fetching next page:", err);
  }
};

useInfiniteScroll(
  loadMoreRef,
  async () => {
    await fetchNextPage();
  },
  { distance: 10 },
);
</script>

<template>
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
        placeholder="Tap to search"
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
            <span>
              Showing {{ games.length }} {{ pluralize("Game", games.length) }}
            </span>
          </div>

          <SearchSort class="hidden sm:flex" />
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="min-h-[calc(100dvh-72px-80px)] px-4 pt-2 @container">
      <!-- Initial Loading Skeleton -->
      <div v-if="isLoading" class="@container">
        <div
          class="grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7"
        >
          <span
            v-for="i in 20"
            :key="i"
            class="aspect-poster animate-pulse rounded-xl bg-gray-400 bg-opacity-20"
          ></span>
        </div>
      </div>

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

      <div
        v-show="isFinished && games.length < 1"
        class="grid h-full place-content-center"
      >
        <span class="">No game found</span>
      </div>
    </section>
  </div>
</template>
