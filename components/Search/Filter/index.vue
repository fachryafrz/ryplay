<script setup>
const { multiquery } = defineProps(["multiquery"]);
</script>

<template>
  <div
    class="sticky top-20 flex flex-col gap-4 rounded-xl bg-neutral p-4 outline outline-secondary"
  >
    <section>
      <h2>Genres</h2>
      <SearchFilterGenres :multiquery="multiquery" />
    </section>

    <section>
      <h2>Platforms</h2>
      <SearchFilterPlatforms :multiquery="multiquery" />
    </section>
  </div>
</template>
