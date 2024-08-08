<script setup>
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const router = useRouter();
const route = useRoute();
const loadMoreRef = ref();
const games = ref([]);
const offset = ref(0);
const showFilter = ref(false);

const isThereAnyFilter = computed(() => {
  return Object.keys(route.query).length > 0;
});

const handleClearFilters = () => {
  router.push({ path: "/search" });
};

const setShowFilter = () => {
  showFilter.value = !showFilter.value;
};

const fetchGames = async () => {
  // NOTE: Pake $fetch kalau tidak perlu Server Side
  const response = await $fetch("/api/games/search", {
    method: "POST",
    params: route.query,
    body: {
      offset: offset.value,
    },
  });

  if (response) {
    // Gabungkan game-game yang sudah ada dengan respons baru
    const combinedGames = [...games.value, ...response];

    // Hapus duplikat berdasarkan id
    const uniqueGames = combinedGames.filter(
      (game, index, self) => index === self.findIndex((t) => t.id === game.id),
    );

    // Update games.value dengan game yang unik
    games.value = uniqueGames;
  }
};
await fetchGames();

useHead({
  title: "Search",
  meta: [
    {
      name: "description",
      content: "Search for your favorite games",
    },
  ],
});

const multiquery = await $fetch("/api/search/multiquery");

watch(
  () => route.query,
  async () => {
    offset.value = 0;
    games.value = [];

    await fetchGames();
  },
  { immediate: true },
);

useInfiniteScroll(loadMoreRef, async () => {
  offset.value += 20;
  await fetchGames();
});
</script>

<template>
  <div class="-mx-4 flex">
    <h1 class="sr-only">Search</h1>

    <!-- Filters -->
    <div
      class="fixed mt-1 lg:pl-4 inset-0 top-[72px] z-[100] h-screen max-h-[calc(100dvh-72px)] transition-all lg:static lg:h-auto lg:max-h-none lg:min-w-[300px] lg:max-w-[300px]"
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
      <div
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
          <div class="flex sm:h-[41px] items-center gap-2">
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

          <SearchSort class="hidden sm:flex" />
        </div>
      </div>

      <!-- Results -->
      <div v-show="games.length < 1" class="flex justify-center">
        <span class="loading loading-spinner"></span>
      </div>

      <GameGrid v-show="games.length > 0" :games="games" class="px-4" />

      <button
        ref="loadMoreRef"
        v-show="games.length >= 20 && games.length >= offset"
        class="pointer-events-none mx-auto mt-4 flex aspect-square"
      >
        <span class="loading loading-spinner"></span>
      </button>
    </div>
  </div>
</template>
