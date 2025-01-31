<script setup>
import axios from "axios";
import pluralize from "pluralize";
import { useInfiniteQuery } from "@tanstack/vue-query";

// Runtime Config and Router
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

// State Management
const showFilter = useShowFilter();
const isFinished = ref(false);

// Computed Properties
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
const fetcher = async ({ pageParam = 0 }) => {
  const response = await axios.get(`${getKey.value}&offset=${pageParam}`);
  return response.data;
};

// Multiquery Fetching
const { data: multiquery, isLoading: isMultiqueryLoading } = useQuery({
  queryKey: ["multiquery"],
  queryFn: () => axios.get("/api/search/multiquery").then((res) => res.data),
  select: (data) => {
    // Transform multiquery data if needed
    return {
      results: data,
      fetchedAt: new Date(),
    };
  },
  staleTime: Infinity,
});

// Infinite Query for Games
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ["games", getKey],
    queryFn: ({ pageParam }) => fetcher({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      // Hitung offset berikutnya berdasarkan jumlah halaman
      const limit = 20; // Batas hasil per halaman
      const currentOffset = allPages.length * limit;

      // Jika jumlah hasil sama dengan batas, lanjutkan ke halaman berikutnya
      if (lastPage.length === limit) {
        return currentOffset;
      }

      // Jika tidak, tidak ada halaman berikutnya
      isFinished.value = true;
      return undefined;
    },
    staleTime: Infinity,
  });

// Process and Deduplicate Games
const games = computed(() => {
  if (!data.value) return [];
  const allGames = data.value.pages.flat();
  const uniqueGames = allGames.filter(
    (game, index, self) => index === self.findIndex((t) => t.id === game.id),
  );
  return uniqueGames;
});

// Watch for Route Changes
onMounted(() => {
  watch(
    () => route.query,
    () => {
      window.scrollTo({ top: 0 });

      // Reset Infinite Scroll
      isFinished.value = false;
    },
    { immediate: true },
  );

  // Update `isFinished` based on cached data
  watchEffect(() => {
    if (data.value) {
      const allGames = data.value.pages.flat();
      const limit = 20; // Batas hasil per halaman
      isFinished.value = allGames.length < limit || !hasNextPage.value;
    }
  });
});

// Infinite Scroll Logic
const loadMoreRef = ref(null);
const isFetchingDelayed = ref(false);

useInfiniteScroll(
  loadMoreRef,
  async () => {
    if (hasNextPage.value && !isFetchingNextPage.value) {
      isFetchingDelayed.value = true; // Set flag to true to prevent multiple triggers

      // Add a delay before fetching the next page
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

      await fetchNextPage();

      isFetchingDelayed.value = false; // Reset flag after fetching
    }
  },
  { distance: 10 },
);

// Functions
const handleClearFilters = () => {
  router.push({ path: "/search" });
};
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
      <SearchFilter
        v-if="!isMultiqueryLoading"
        :multiquery="multiquery.results"
      />

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
