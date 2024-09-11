<script setup>
import VueMultiselect from "vue-multiselect";

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const keywords = ref([]);
const selectedValues = ref(null);

const fetchKeywords = async (query, body) => {
  isLoading.value = true;

  const data = await $fetch("/api/keywords", {
    method: "POST",
    params: {
      name: query,
    },
    body: {
      body: body
        ? body
        : `
        f *; 
        w name ~ *"${query}"* | slug ~ *"${query}"*;
        s name asc;
        l 10;`,
    },
  });

  if (data.length < 1) {
    isLoading.value = false;
    // keywords.value = [];
  }

  if (data.length > 0) {
    isLoading.value = false;
    keywords.value = data;

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
        keyword: newValues,
      },
    });
  } else {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        keyword: undefined,
      },
    });
  }
});

watch(
  () => route.query,
  async (searchParams) => {
    if (searchParams.keyword) {
      const separateItem = searchParams.keyword
        .split(",")
        .map((i) => `"${i}"`)
        .join(",");

      const keywordsData = await fetchKeywords(
        searchParams.keyword,
        `f *; w slug = (${separateItem}); s name asc; l 10;`,
      );

      selectedValues.value = keywordsData;
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
      :options="keywords"
      :loading="isLoading"
      @search-change="fetchKeywords"
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
