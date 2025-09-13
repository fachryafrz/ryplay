<script setup>
const { game, externalGames, findStoreById } = defineProps([
  "game",
  "externalGames",
  "findStoreById",
]);
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li>
      <div
        className="tooltip tooltip-secondary tooltip-bottom before:hidden sm:before:block"
        data-tip="Internet Game Database"
      >
        <button
          @click="handleOpenWindow(`https://www.igdb.com/games/${game.slug}`)"
        >
          <img
            :src="`/store_icons/igdb.png`"
            :alt="''"
            class="aspect-square w-[50px] object-contain"
            draggable="false"
            loading="lazy"
            role="presentation"
            aria-hidden="true"
          />
        </button>
      </div>
    </li>
    <li
      v-for="externalGame in externalGames"
      :key="externalGame.external_game_source"
    >
      <div
        className="tooltip tooltip-secondary tooltip-bottom before:hidden sm:before:block"
        :data-tip="findStoreById(externalGame.external_game_source).store"
      >
        <button @click="handleOpenWindow(externalGame.url)">
          <img
            :src="`/store_icons/${findStoreById(externalGame.external_game_source).image_id}.png`"
            :alt="''"
            class="aspect-square w-[50px] object-contain"
            draggable="false"
            loading="lazy"
            role="presentation"
            aria-hidden="true"
          />
        </button>
      </div>
    </li>
  </ul>
</template>
