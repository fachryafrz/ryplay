<script setup>
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const route = useRoute();
const loadMoreRef = ref();
const games = ref([]);
const offset = ref(0);
const showFilter = ref(false);

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

  if (response) games.value.push(...response);
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
  offset.value += 10;
  await fetchGames();
});
</script>

<template>
  <div class="flex gap-4">
    <h1 class="sr-only">Search</h1>
    <!-- Filters -->
    <div
      class="fixed inset-0 z-[99] h-screen transition-all lg:static lg:h-auto lg:min-w-[300px] lg:max-w-[300px]"
      :class="{
        '-translate-x-full lg:translate-x-0': !showFilter,
        'translate-x-0': showFilter,
      }"
    >
      <SearchFilter :multiquery="multiquery" />

      <button
        @click="setShowFilter"
        class="btn btn-square btn-secondary absolute right-4 top-4 lg:hidden"
      >
        <Icon name="ion:close" size="28" />
      </button>
    </div>

    <!-- Results -->
    <div class="w-full">
      <SearchBar
        class="mb-4 mt-2"
        :class="{
          'sm:hidden': route.path === '/search',
        }"
      />

      <button @click="setShowFilter" class="btn btn-secondary lg:hidden">
        Filters
        <Icon name="ion:filter" size="20" />
      </button>

      <div v-show="games.length < 1" class="flex justify-center">
        <span class="loading loading-spinner"></span>
      </div>

      <GameGrid v-show="games.length > 0" :games="games" />

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
