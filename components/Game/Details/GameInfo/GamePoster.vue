<script setup>
const { game, gameCover, gameInfo, publishers } = defineProps([
  "game",
  "gameCover",
  "gameInfo",
  "publishers",
]);
</script>

<template>
  <div class="@container w-full">
    <!-- Container -->
    <div
      class="@md:items-center @md:max-w-2xl @md:mx-auto @md:grid @md:grid-cols-2 sticky top-4 flex flex-col gap-4 rounded-xl bg-secondary p-4"
    >
      <figure class="">
        <img :src="gameCover" :alt="game.name" class="rounded-md" />
      </figure>

      <div class="flex flex-col gap-4">
        <h1 class="@md:text-start text-pretty text-center text-2xl font-bold">
          {{ game.name }}
        </h1>

        <!-- Genres -->
        <ul
          class="@md:justify-start flex flex-wrap items-center justify-center gap-1"
        >
          <li v-for="genre in game.genres">
            <span
              class="block rounded-full bg-base-100 bg-opacity-[75%] px-4 py-2 text-xs font-medium backdrop-blur"
            >
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
