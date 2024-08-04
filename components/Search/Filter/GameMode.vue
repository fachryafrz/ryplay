<script setup>
const { multiquery } = defineProps(["multiquery"]);

const router = useRouter();
const route = useRoute();

const gameModes = multiquery.find((i) => i.name === "game-modes").result;
const selectedValues = ref([]);

const setSelectedValue = (event) => {
  const isChecked = event.target.checked;

  if (isChecked) {
    selectedValues.value = gameModes.map((c) => c.id);
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
        game_mode: newValues.join(","),
      },
    });
  } else {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        game_mode: undefined,
      },
    });
  }
});

watch(
  () => route.query,
  (searchParams) => {
    if (searchParams.game_mode) {
      selectedValues.value = searchParams.game_mode
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
  <div class="grid gap-2 @xs:grid-cols-2 [&_label]:text-sm">
    <div class="flex items-center gap-2">
      <input
        id="game_mode_all"
        type="checkbox"
        class="checkbox checkbox-sm rounded-md"
        @change="setSelectedValue"
        :checked="selectedValues.length === gameModes.length"
      />
      <label for="game_mode_all" class="flex w-full cursor-pointer"> All </label>
    </div>

    <div
      v-for="game_mode in gameModes"
      :key="game_mode.id"
      class="flex items-center gap-2"
    >
      <input
        :id="`game_mode_${game_mode.id}`"
        v-model="selectedValues"
        :value="game_mode.id"
        type="checkbox"
        name="game_mode"
        class="checkbox checkbox-sm rounded-md"
      />
      <label
        :for="`game_mode_${game_mode.id}`"
        class="flex w-full cursor-pointer"
      >
        {{ game_mode.name }}
      </label>
    </div>
  </div>
</template>
