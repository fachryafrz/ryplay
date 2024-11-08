<script setup>
const searchQuery = ref("");
const router = useRouter();
const route = useRoute();
const inputRef = ref(null);

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
          placeholder="Search"
        />
        <button
          v-show="searchQuery"
          @click="clearSearch"
          type="button"
          class="material-symbols-outlined"
        >
          close
        </button>
        <div class="hidden xl:inline">
          <kbd class="kbd kbd-sm">/</kbd>
        </div>
      </label>
    </form>
  </div>
</template>
