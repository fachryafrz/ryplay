<script setup>
import VueMultiselect from "vue-multiselect";

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const companies = ref([]);
const selectedValues = ref(null);
const timerRef = ref(null);

const fetchCompanies = async (query, body) => {
  isLoading.value = true;

  const data = await $fetch("/api/companies", {
    method: "POST",
    params: {
      name: query,
    },
    body: {
      body: body
        ? body
        : `
        f *; 
        w name ~ *"${query}"* | slug ~ *"${query.replace(/ /g, "-")}"*;
        l 10;`,
    },
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
};

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

      const companiesData = await fetchCompanies(
        searchParams.company,
        `f *; w slug = (${separateItem}); s name asc; l 10;`,
      );

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
