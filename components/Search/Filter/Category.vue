<script setup>
import gameCategory from "@/json/game-category.json";

const router = useRouter();
const route = useRoute();

const categories = gameCategory.filter((category) =>
  [0, 1, 2, 3, 4, 8, 9, 10, 11].includes(category.id),
);
const selectedValues = ref([]);

const setSelectedValue = (event) => {
  const isChecked = event.target.checked;

  if (isChecked) {
    selectedValues.value = categories.map((c) => c.id);
  } else {
    selectedValues.value = [];
  }
};

watch(selectedValues, (newValues, oldValues) => {
  if (newValues.length) {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        category: newValues.join(","),
      },
    });
  } else {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        category: undefined,
      },
    });
  }
});

watch(
  () => route.query,
  (searchParams) => {
    if (searchParams.category) {
      selectedValues.value = searchParams.category
        .split(",")
        .map((i) => parseInt(i));
    } else {
      selectedValues.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="grid gap-2 @xs:grid-flow-col @xs:grid-rows-5 @xl:grid-rows-4 @3xl:grid-rows-3 [&_label]:text-sm"
  >
    <div class="flex items-center">
      <input
        id="category_all"
        type="checkbox"
        class="checkbox checkbox-sm rounded-md"
        @change="setSelectedValue"
        :checked="selectedValues.length === categories.length"
      />
      <label for="category_all" class="flex w-full cursor-pointer pl-2">
        All
      </label>
    </div>

    <div
      v-for="category in categories"
      :key="category.id"
      class="flex items-center"
    >
      <input
        :id="`category_${category.id}`"
        v-model="selectedValues"
        :value="category.id"
        type="checkbox"
        name="category"
        class="checkbox checkbox-sm rounded-md"
      />
      <label
        :for="`category_${category.id}`"
        class="flex w-full cursor-pointer pl-2"
      >
        {{ category.name }}
      </label>
    </div>
  </div>
</template>
