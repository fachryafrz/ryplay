<script setup>
const { multiquery } = defineProps(["multiquery"]);
</script>

<template>
  <div
    class="sticky mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto top-20 flex flex-col gap-4 rounded-xl bg-neutral p-4 outline outline-secondary @container"
  >
    <section>
      <h2>Category</h2>
      <SearchFilterCategory :multiquery="multiquery" />
    </section>

    <section>
      <h2>Genre</h2>
      <SearchFilterGenre :multiquery="multiquery" />
    </section>

    <section>
      <h2>Platform</h2>
      <SearchFilterPlatform :multiquery="multiquery" />
    </section>

    <section>
      <h2>Theme</h2>
      <SearchFilterTheme :multiquery="multiquery" />
    </section>
  </div>
</template>
