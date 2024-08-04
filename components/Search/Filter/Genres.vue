<script setup>
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const { multiquery } = defineProps(["multiquery"]);

const router = useRouter();
const route = useRoute();

const genres = multiquery.find((i) => i.name === "genres").result;
const selectedValues = ref([]);

const setSelectedValue = (value) => {
  const getIdentifiers = value.map((i) => i.slug).join(",");

  router.push({
    path: "/search",
    query: {
      ...route.query,
      genre: getIdentifiers,
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
        genre: updatedValues,
      },
    });
  } else {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        genre: undefined,
      },
    });
  }
};

watch(
  () => route.query,
  async (searchParams) => {
    if (searchParams.genre) {
      selectedValues.value = searchParams.genre.split(",").map((i) => {
        return genres.find((item) => item.slug === i);
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
    :options="genres"
    :reduce="(value) => value.slug"
    @option:selected="(value) => setSelectedValue(value)"
    @option:deselected="(value) => setDeselectValue(value)"
    label="name"
    placeholder="Select genres"
  />
</template>
