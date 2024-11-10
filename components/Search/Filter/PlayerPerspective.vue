<script setup>
const { multiquery } = defineProps(["multiquery"]);

const router = useRouter();
const route = useRoute();

const playerPerspectives = multiquery.find(
  (i) => i.name === "player-perspectives",
).result;
const selectedValues = ref([]);

const setSelectedValue = (event) => {
  const isChecked = event.target.checked;

  if (isChecked) {
    selectedValues.value = playerPerspectives.map((c) => c.id);
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
        player_perspective: newValues.join(","),
      },
    });
  } else {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        player_perspective: undefined,
      },
    });
  }
});

watch(
  () => route.query,
  (searchParams) => {
    if (searchParams.player_perspective) {
      selectedValues.value = searchParams.player_perspective
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
    class="grid gap-2 @lg:grid-flow-col @lg:grid-rows-4 @xl:grid-rows-3 [&_label]:text-sm"
  >
    <div class="flex items-center">
      <input
        id="player_perspective_all"
        type="checkbox"
        class="checkbox checkbox-sm rounded-md"
        @change="setSelectedValue"
        :checked="selectedValues.length === playerPerspectives.length"
      />
      <label
        for="player_perspective_all"
        class="flex w-full cursor-pointer pl-2"
      >
        All
      </label>
    </div>

    <div
      v-for="player_perspective in playerPerspectives"
      :key="player_perspective.id"
      class="flex items-center"
    >
      <input
        :id="`player_perspective_${player_perspective.id}`"
        v-model="selectedValues"
        :value="player_perspective.id"
        type="checkbox"
        name="player_perspective"
        class="checkbox checkbox-sm rounded-md"
      />
      <label
        :for="`player_perspective_${player_perspective.id}`"
        class="flex w-full cursor-pointer pl-2"
      >
        {{ player_perspective.name }}
      </label>
    </div>
  </div>
</template>
