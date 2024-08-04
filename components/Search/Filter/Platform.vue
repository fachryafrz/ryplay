<script setup>
import VueMultiselect from "vue-multiselect";

const { multiquery } = defineProps(["multiquery"]);

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const platforms = ref([]);
const selectedValues = ref(null);

const fetchPlatforms = async (query, body) => {
  isLoading.value = true;

  const data = await $fetch("/api/platforms", {
    method: "POST",
    params: {
      name: query,
    },
    body: {
      body: body ? body : `f *; search "${query}"; l 10;`,
    },
  });

  isLoading.value = false;
  platforms.value = data;

  return data;
};

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

      const platformsData = await fetchPlatforms(
        searchParams.platform,
        `f *; w slug = (${separateItem}); s name asc; l 10;`,
      );

      selectedValues.value = platformsData;
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
    ></VueMultiselect>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
