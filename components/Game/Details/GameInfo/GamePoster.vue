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
      class="sticky top-4 flex flex-col gap-4 rounded-xl border-2 border-secondary bg-neutral p-4 @md:mx-auto @md:grid @md:max-w-2xl @md:grid-cols-2 @md:items-center"
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
        <ul class="flex flex-col gap-0">
          <li v-for="info in gameInfo" class="flex items-center gap-2 text-sm">
            <span v-if="info.text" class="material-symbols-outlined !text-lg">{{
              info.icon
            }}</span>
            <span v-if="info.text" class="">{{ info.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
