<script setup>
import VueMultiselect from "vue-multiselect";

const { multiquery } = defineProps(["multiquery"]);

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const keywords = ref([]);
const selectedValues = ref(null);

const fetchKeywords = async (query) => {
  isLoading.value = true;

  const data = await $fetch("/api/keywords", {
    params: {
      name: query,
    },
  });

  isLoading.value = false;
  keywords.value = data;

  return data;
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
      const keywordsData = await fetchKeywords(searchParams.keyword);

      selectedValues.value = keywordsData;
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
    ></VueMultiselect>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
