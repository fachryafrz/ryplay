<script setup>
const searchQuery = ref("");
const router = useRouter();
const route = useRoute();
const inputRef = ref(null);

const handleSubmit = () => {
  if (searchQuery.value) {
    router.push({
      path: "/search",
      query: { query: searchQuery.value.trim() },
    });
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  router.push({
    path: "/search",
    query: {
      ...route.query,
      query: undefined,
    },
  });
};

watch(
  () => route.query,
  () => {
    searchQuery.value = route.query.query;
  },
  { immediate: true },
);

onKeyStroke("/", (e) => {
  e.preventDefault();
  router.push({
    path: "/search",
  });
  inputRef.value.focus();
});
</script>

<template>
  <div class="flex w-full gap-4">
    <form @submit.prevent="handleSubmit" class="flex w-full items-center gap-2">
      <label
        class="input input-md flex w-full items-center gap-2 rounded-lg bg-neutral outline outline-secondary xl:max-w-md"
      >
        <span class="material-symbols-outlined"> search </span>
        <input
          v-model="searchQuery"
          ref="inputRef"
          type="text"
          class="w-full grow"
          placeholder="Search"
        />
        <button
          v-show="route.query.query"
          @click="clearSearch"
          type="button"
          class="material-symbols-outlined"
        >
          close
        </button>
        <NuxtLink to="/search" class="hidden xl:inline"
          ><kbd class="kbd kbd-sm">/</kbd></NuxtLink
        >
      </label>
    </form>
  </div>
</template>
