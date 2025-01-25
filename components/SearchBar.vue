<script setup>
import Typewriter from "typewriter-effect/dist/core";

const searchQuery = ref("");
const router = useRouter();
const route = useRoute();
const inputRef = ref(null);
const typewriter = ref(null);

const handleSubmit = () => {
  if (searchQuery.value) {
    router.push({
      path: "/search",
      query: {
        ...route.query,
        company: undefined,
        query: searchQuery.value.trim(),
      },
    });

    inputRef.value.blur();
  }
};

const clearSearch = () => (searchQuery.value = "");

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
    .typeString("Type / to search")
    .pauseFor(5e3)
    .start();

  const onKeyDown = (event) => {
    if (event.key === "/") {
      if (document.activeElement !== inputRef.value) {
        event.preventDefault();
        inputRef.value.focus();
      }
      // Jangan prevent default jika input sudah fokus agar "/" bisa diketik
    }

    if (event.key === "Escape") {
      if (document.activeElement === inputRef.value) {
        inputRef.value.blur();
      }
    }
  };

  window.addEventListener("keydown", onKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeyDown);
  });
});
</script>

<template>
  <div class="flex w-full gap-4">
    <form @submit.prevent="handleSubmit" class="flex w-full items-center gap-2">
      <label
        class="input input-md flex w-full items-center gap-2 rounded-lg bg-neutral outline outline-secondary xl:max-w-md"
      >
        <NuxtLink to="/search" class="flex">
          <span class="material-symbols-outlined"> search </span>
        </NuxtLink>
        <input
          v-model="searchQuery"
          ref="inputRef"
          type="text"
          class="w-full grow"
        />
        <button
          v-show="searchQuery"
          @click="clearSearch"
          type="button"
          class="material-symbols-outlined"
        >
          close
        </button>
      </label>
    </form>
  </div>
</template>
