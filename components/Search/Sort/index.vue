<script setup>
const router = useRouter();
const route = useRoute();

const sortByTypeOptions = [
  { name: "Popularity", value: "hypes" },
  { name: "Rating", value: "total_rating_count" },
  { name: "Release Date", value: "first_release_date" },
];
const sortByOrderOptions = [
  { name: "Ascending", value: "asc" },
  { name: "Descending", value: "desc" },
];

const sortByType = ref(sortByTypeOptions[0]);
const sortByOrder = ref(sortByOrderOptions[1]);

const setSortByType = (value) => {
  sortByType.value = value;
};
const setSortByOrder = (value) => {
  sortByOrder.value = value;
};

watch([sortByType, sortByOrder], () => {
  router.push({
    path: "/search",
    query: {
      ...route.query,
      sort: `${sortByType.value.value} ${sortByOrder.value.value}`,
    },
  });
});

watch(
  () => route.query,
  (searchParams) => {
    if (searchParams.sort) {
      const [sortByTypeValue, sortByOrderValue] = searchParams.sort.split(" ");

      sortByType.value = sortByTypeOptions.find(
        (option) => option.value === sortByTypeValue,
      );
      sortByOrder.value = sortByOrderOptions.find(
        (option) => option.value === sortByOrderValue,
      );
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="flex items-center justify-center gap-2 sm:justify-normal [&>div]:w-full sm:[&>div]:w-[160px]"
  >
    <SearchSortType
      :selected-value="sortByType"
      :set-sort-by-type="setSortByType"
      :sort-options="sortByTypeOptions"
    />

    <SearchSortOrder
      :selected-value="sortByOrder"
      :set-sort-by-order="setSortByOrder"
      :sort-options="sortByOrderOptions"
    />
  </div>
</template>
