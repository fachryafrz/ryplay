<script setup>
import Typewriter from "typewriter-effect/dist/core";

const { placeholder } = defineProps(["placeholder"]);

// Constants
const DEBOUNCE_DELAY = 300;

// Refs
const searchQuery = ref("");
const router = useRouter();
const route = useRoute();
const inputRef = ref(null);
const autocompleteData = ref([]);
const isFocus = ref(false);
const highlightedIndex = ref(-1);

// Methods
const handleSubmit = () => {
  if (!searchQuery.value) return;

  router.push({
    path: "/search",
    query: {
      ...route.query,
      company: undefined,
      query: searchQuery.value.trim(),
    },
  });

  inputRef.value.blur();
};
const clearSearch = () => (searchQuery.value = "");
const handleFocus = () => (isFocus.value = true);
const handleBlur = (e) => {
  if (e.relatedTarget?.closest(".autocomplete-suggestions")) return;
  isFocus.value = false;
};
const debounce = useDebounceFn(async (e) => {
  const response = await $fetch(`/api/games/search`, {
    params: { query: e.target.value },
  });

  const filteredResponse = response.filter((item, index, self) => {
    const gameName = item.name.toLowerCase();

    return self.findIndex((t) => t.name.toLowerCase() === gameName) === index;
  });

  autocompleteData.value = filteredResponse.slice(0, 10);
}, DEBOUNCE_DELAY);
const handleAutocomplete = (e) => {
  if (!e.target.value) {
    autocompleteData.value = [];
    return;
  }

  highlightedIndex.value = -1;

  debounce(e);
};
const handleKeyDown = (e) => {
  // START: For selecting and deleting input or search box
  if (e.key === "/") {
    if (document.activeElement !== inputRef.value) {
      e.preventDefault();
      inputRef.value.focus();
    }
    // Jangan prevent default jika input sudah fokus agar "/" bisa diketik
  }

  if (e.key === "Escape") {
    if (document.activeElement === inputRef.value) {
      inputRef.value.blur();
    }
  }
  // END: For selecting and deleting input or search box

  // START: Keyboard navigation for autocomplete
  const totalItems = autocompleteData.value.length;

  if (!isFocus.value || totalItems === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    highlightedIndex.value =
      highlightedIndex.value === totalItems - 1
        ? 0
        : highlightedIndex.value + 1;
    searchQuery.value =
      autocompleteData.value[highlightedIndex.value].name.toLowerCase();
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    highlightedIndex.value =
      highlightedIndex.value <= 0 ? totalItems - 1 : highlightedIndex.value - 1;
    searchQuery.value =
      autocompleteData.value[highlightedIndex.value].name.toLowerCase();
  }

  if (e.key === "Enter") {
    e.preventDefault();

    if (highlightedIndex.value >= 0 && highlightedIndex.value < totalItems) {
      const selectedItem = autocompleteData.value[highlightedIndex.value];
      router.push({
        path: "/search",
        query: {
          query: selectedItem.name.toLowerCase().replace(/\s+/g, " "),
        },
      });
    } else {
      handleSubmit();
    }

    inputRef.value.blur();
  }
  // END: Keyboard navigation for autocomplete
};

// Lifecycle
watch(
  () => route.query,
  () => {
    if (route.query.query) {
      searchQuery.value = route.query.query;
    }
  },
  { immediate: true },
);
onMounted(() => {
  let input = inputRef.value;

  const customNodeCreator = (character) => {
    // Add character to input placeholder
    input.placeholder = input.placeholder + character;

    // Return null to skip internal adding of dom node
    return null;
  };

  const onRemoveNode = ({ character }) => {
    if (input.placeholder) {
      // Remove last character from input placeholder
      input.placeholder = input.placeholder.slice(0, -1);
    }
  };

  const typewriter = new Typewriter(null, {
    loop: true,
    delay: 50,
    onCreateTextNode: customNodeCreator,
    onRemoveNode: onRemoveNode,
  });

  typewriter
    .typeString("Search a game title")
    .pauseFor(5e3)
    .deleteAll()
    .typeString(placeholder)
    .pauseFor(15e3)
    .start();
});
useEventListener(document, "keydown", handleKeyDown);
</script>

<template>
  <div class="relative flex w-full gap-4">
    <form @submit.prevent="handleSubmit" class="flex w-full items-center gap-2">
      <label
        class="input input-md flex w-full items-center gap-2 rounded-lg bg-neutral outline outline-secondary"
      >
        <NuxtLink to="/search" class="flex">
          <Icon name="ion:search" size="20" />
        </NuxtLink>
        <input
          v-model="searchQuery"
          ref="inputRef"
          type="text"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleAutocomplete"
          class="w-full grow"
        />
        <button
          @click="clearSearch"
          type="button"
          :class="['flex', { hidden: searchQuery === '' }]"
        >
          <Icon name="ion:close" size="25" />
        </button>
      </label>
    </form>

    <div
      v-if="isFocus && autocompleteData.length > 0"
      class="absolute inset-x-0 top-full mt-2"
    >
      <div class="rounded-box bg-base-200 p-2 text-sm">
        <ul class="autocomplete-suggestions">
          <li v-for="(game, index) in autocompleteData">
            <NuxtLink
              :to="`/search?query=${game.name.toLowerCase().replace(/\s+/g, '+')}`"
              tabindex="-1"
              @click="isFocus = false"
              @mouseenter="highlightedIndex = index"
              @mouseleave="highlightedIndex = -1"
              :class="[
                'flex gap-2 rounded-lg p-2 hocus:bg-white hocus:bg-opacity-10',
                { 'bg-white bg-opacity-10': highlightedIndex === index },
              ]"
            >
              <Icon name="ion:search" size="20" class="mt-0.5" />

              <span class="flex-1">{{ game.name.toLowerCase() }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
