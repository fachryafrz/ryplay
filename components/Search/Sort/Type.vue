<script setup>
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const route = useRoute();

const isThereIsQueryParam = ref(false);

const { selectedValue, setSortByType, sortOptions } = defineProps([
  "selectedValue",
  "setSortByType",
  "sortOptions",
]);

watch(
  () => route.query,
  ({ query }) => {
    if (query) {
      isThereIsQueryParam.value = true;
    } else {
      isThereIsQueryParam.value = false;
    }
  },
);
</script>

<template>
  <div class="w-[160px] text-sm [&_.vs__selected]:!bg-transparent">
    <VueSelect
      :modelValue="selectedValue"
      :options="sortOptions"
      :reduce="(value) => value.value"
      @option:selected="(value) => setSortByType(value)"
      label="name"
      :clearable="false"
      :disabled="isThereIsQueryParam"
    />
  </div>
</template>
