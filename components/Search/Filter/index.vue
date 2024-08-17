<script setup>
const { multiquery } = defineProps(["multiquery"]);
</script>

<template>
  <div
    class="flex h-full flex-col gap-4 overflow-y-auto bg-neutral bg-opacity-[98%] p-4 backdrop-blur @container lg:sticky lg:top-[calc(72px+3px)] lg:max-h-[calc(100dvh-72px-6px-1rem)] lg:rounded-xl lg:outline lg:outline-secondary [&_section]:flex [&_section]:flex-col [&_section]:gap-2"
  >
    <section class="sm:!hidden">
      <h2 class="heading-2 text-sm">Sort</h2>
      <SearchSort />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Release Date</h2>
      <SearchFilterReleaseDate />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Category</h2>
      <SearchFilterCategory />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Genre</h2>
      <SearchFilterGenre :multiquery="multiquery" />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Platform</h2>
      <SearchFilterPlatform :multiquery="multiquery" />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Game Mode</h2>
      <SearchFilterGameMode :multiquery="multiquery" />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Theme</h2>
      <SearchFilterTheme :multiquery="multiquery" />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Keyword</h2>
      <SearchFilterKeyword :multiquery="multiquery" />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Player Perspective</h2>
      <SearchFilterPlayerPerspective :multiquery="multiquery" />
    </section>
  </div>
</template>
