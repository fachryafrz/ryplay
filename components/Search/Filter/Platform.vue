<script setup>
import VueMultiselect from "vue-multiselect";

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const platforms = ref([]);
const selectedValues = ref(null);
const timerRef = ref(null);

const fetchPlatforms = useDebounceFn(async (query, isMulti = false) => {
  if (!query) return;

  isLoading.value = true;

  const data = await $fetch("/api/platforms", {
    method: "POST",
    params: { name: query, isMulti },
  });

  if (data.length < 1) {
    isLoading.value = false;
    // platforms.value = [];
  }

  if (data.length > 0) {
    isLoading.value = false;
    platforms.value = data;

    return data;
  }
}, 1000);

watch(selectedValues, (newValues) => {
  if (newValues.length) {
    newValues = newValues.map((i) => i.slug).join(",");

    router.push({
      path: "/search",
      query: {
        ...route.query,
        platform: newValues,
      },
    });
  } else {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        platform: undefined,
      },
    });
  }
});

watch(
  () => route.query,
  async (searchParams) => {
    if (searchParams.platform) {
      const separateItem = searchParams.platform
        .split(",")
        .map((i) => `"${i}"`)
        .join(",");

      const platformsData = await fetchPlatforms(separateItem, true);

      selectedValues.value = platformsData;
    } else {
      selectedValues.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <VueMultiselect
      v-model="selectedValues"
      multiple
      :options="platforms"
      :loading="isLoading"
      @search-change="fetchPlatforms"
      label="name"
      track-by="id"
      :hide-selected="true"
    >
      <template #noResult>
        <span>No result found.</span>
      </template>
    </VueMultiselect>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
