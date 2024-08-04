<script setup>
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const { selectedValue, setSortByType, sortOptions } = defineProps([
  "selectedValue",
  "setSortByType",
  "sortOptions",
]);
</script>

<template>
  <div class="w-[150px] text-sm">
    <VueSelect
      :modelValue="selectedValue"
      :options="sortOptions"
      :reduce="(value) => value.value"
      @option:selected="(value) => setSortByType(value)"
      label="name"
      :clearable="false"
    />
  </div>
</template>
