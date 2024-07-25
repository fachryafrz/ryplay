<script setup>
const searchQuery = ref("");
const router = useRouter();
const route = useRoute();

const handleSubmit = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: "/search", query: { query: searchQuery.value } });
  }
};

watch(
  () => route.query,
  () => {
    searchQuery.value = route.query.query;
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="flex w-full gap-4"
    :class="{
      hidden: disableSearchBar,
    }"
  >
    <form @submit.prevent="handleSubmit" class="flex w-full items-center gap-2">
      <label
        class="input input-md flex w-full items-center gap-2 bg-neutral outline outline-secondary xl:max-w-md"
      >
        <span class="material-symbols-outlined"> search </span>
        <input
          v-model="searchQuery"
          type="text"
          class="grow"
          placeholder="Find games..."
        />
      </label>
    </form>
  </div>
</template>
