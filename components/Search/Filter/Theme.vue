<script setup>
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const { multiquery } = defineProps(["multiquery"]);

const router = useRouter();
const route = useRoute();

const themes = multiquery.find((i) => i.name === "themes").result;
const selectedValues = ref([]);

const setSelectedValue = (value) => {
  const getIdentifiers = value.map((i) => i.slug).join(",");

  router.push({
    path: "/search",
    query: {
      ...route.query,
      theme: getIdentifiers,
    },
  });
};
const setDeselectValue = (value) => {
  const updatedValues = selectedValues.value
    .filter((i) => i.slug !== value.slug)
    .join(",");

  if (updatedValues.length) {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        theme: updatedValues,
      },
    });
  } else {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        theme: undefined,
      },
    });
  }
};

watch(
  () => route.query,
  async (searchParams) => {
    if (searchParams.theme) {
      selectedValues.value = searchParams.theme.split(",").map((i) => {
        return themes.find((item) => item.slug === i);
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <VueSelect
    multiple
    v-model="selectedValues"
    :options="themes"
    :reduce="(value) => value.slug"
    @option:selected="(value) => setSelectedValue(value)"
    @option:deselected="(value) => setDeselectValue(value)"
    label="name"
    placeholder="Select theme"
  />
</template>
