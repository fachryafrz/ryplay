<script setup>
const { game, gameCover, gameInfo, publishers } = defineProps([
  "game",
  "gameCover",
  "gameInfo",
  "publishers",
]);
</script>

<template>
  <div class="w-full @container">
    <!-- Container -->
    <div
      class="sticky top-[calc(5rem+0.5rem)] flex flex-col gap-4 rounded-xl bg-neutral p-4 outline outline-secondary @md:mx-auto @md:grid @md:max-w-2xl @md:grid-cols-2 @md:items-center"
    >
      <figure class="">
        <img :src="gameCover" :alt="game.name" class="rounded-md" />
      </figure>

      <div class="flex flex-col gap-4">
        <h1 class="text-pretty text-center text-2xl font-bold @md:text-start">
          {{ game.name }}
        </h1>

        <!-- Genres -->
        <ul
          class="flex flex-wrap items-center justify-center gap-1 @md:justify-start"
        >
          <li v-for="genre in game.genres">
            <span class="btn btn-secondary btn-sm">
              {{ genre.name }}
            </span>
          </li>
        </ul>

        <!-- Release date, devs, publishers -->
        <ul class="flex flex-col gap-4">
          <li
            v-for="info in gameInfo"
            class="flex flex-col items-start text-sm"
          >
            <span v-if="info.text" class="font-medium text-neutral-500">{{
              info.section
            }}</span>
            <span v-if="info.text" class="font-semibold">{{ info.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
