<script setup>
import VueMultiselect from "vue-multiselect";

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const companies = ref([]);
const selectedValues = ref(null);
const timerRef = ref(null);

const fetchCompanies = useDebounceFn(async (query, isMulti = false) => {
  if (!query) return;
  
  isLoading.value = true;

  const data = await $fetch("/api/companies", {
    method: "POST",
    params: { name: query, isMulti },
  });

  if (data.length < 1) {
    isLoading.value = false;
    // companies.value = [];
  }

  if (data.length > 0) {
    isLoading.value = false;
    companies.value = data;

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
        company: newValues,
      },
    });
  } else {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        company: undefined,
      },
    });
  }
});

watch(
  () => route.query,
  async (searchParams) => {
    if (searchParams.company) {
      const separateItem = searchParams.company
        .split(",")
        .map((i) => `"${i}"`)
        .join(",");

      const companiesData = await fetchCompanies(separateItem, true);

      selectedValues.value = companiesData;
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
      :options="companies"
      :loading="isLoading"
      @search-change="fetchCompanies"
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
