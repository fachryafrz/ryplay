<script setup>
import VueMultiselect from "vue-multiselect";

const { multiquery } = defineProps(["multiquery"]);

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const platforms = ref([]);
const selectedValues = ref(null);
const timerRef = ref(null);

const fetchPlatforms = async (query, body) => {
  isLoading.value = true;

  // Delay pengambilan data selama 1000ms setelah pengguna berhenti mengetik
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = await $fetch("/api/platforms", {
    method: "POST",
    params: {
      name: query,
    },
    body: {
      body: body ? body : `f *; search "${query}"; l 10;`,
    },
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
