<script setup>
const { multiquery } = defineProps(["multiquery"]);
</script>

<template>
  <div
    class="flex h-full flex-col gap-4 overflow-y-auto bg-neutral p-4 @container lg:sticky lg:top-20 lg:mt-2 lg:max-h-[calc(100dvh-6rem)] lg:rounded-xl lg:outline lg:outline-secondary [&_section]:flex [&_section]:flex-col [&_section]:gap-2"
  >
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
      <h2 class="heading-2 text-sm">Theme</h2>
      <SearchFilterTheme :multiquery="multiquery" />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Game Mode</h2>
      <SearchFilterGameMode :multiquery="multiquery" />
    </section>

    <section>
      <h2 class="heading-2 text-sm">Player Perspective</h2>
      <SearchFilterPlayerPerspective :multiquery="multiquery" />
    </section>
  </div>
</template>
