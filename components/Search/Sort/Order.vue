<script setup>
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const route = useRoute();

const isThereIsQueryParam = ref(false);

const { selectedValue, setSortByOrder, sortOptions } = defineProps([
  "selectedValue",
  "setSortByOrder",
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
  <div class="w-[160px] text-sm">
    <VueSelect
      :modelValue="selectedValue"
      :options="sortOptions"
      :reduce="(value) => value.value"
      @option:selected="(value) => setSortByOrder(value)"
      label="name"
      :clearable="false"
      :disabled="isThereIsQueryParam"
      :searchable="false"
    />
  </div>
</template>
