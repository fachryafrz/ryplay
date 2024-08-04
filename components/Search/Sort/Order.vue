<script setup>
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const { selectedValue, setSortByOrder, sortOptions } = defineProps([
  "selectedValue",
  "setSortByOrder",
  "sortOptions",
]);
</script>

<template>
  <div class="w-[150px] text-sm">
    <VueSelect
      :modelValue="selectedValue"
      :options="sortOptions"
      :reduce="(value) => value.value"
      @option:selected="(value) => setSortByOrder(value)"
      label="name"
      :clearable="false"
    />
  </div>
</template>
