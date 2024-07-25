<script setup>
import { formatNumber, formatRating } from "~/helper/formats";
import GameStores from "./GameStores.vue";

const { game } = defineProps(["game"]);
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 gap-x-12 gap-y-4 rounded-xl outline outline-secondary bg-neutral p-6 @md:grid-cols-2"
  >
    <!-- Compatible with -->
    <div>
      <h2 class="heading-2">Compatible with</h2>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="platform in game.platforms"
          class="btn btn-secondary btn-sm"
        >
          {{ platform.abbreviation }}
        </div>
      </div>
    </div>

    <!-- Available in -->
    <div v-if="game.external_games?.length > 0">
      <h2 class="heading-2">Available in</h2>

      <GameStores :game="game" />
    </div>

    <!-- Genres -->
    <div>
      <h2 class="heading-2">Genres</h2>

      <div class="flex flex-wrap gap-2">
        <div v-for="genre in game.genres" class="btn btn-secondary btn-sm">
          {{ genre.name }}
        </div>
      </div>
    </div>

    <!-- Ratings -->
    <div>
      <h2 class="heading-2">Ratings</h2>

      <div class="flex items-center gap-1 text-lg sm:text-2xl">
        <span class="material-symbols-outlined fill !text-xl sm:!text-3xl">
          star
        </span>
        <span class="font-semibold">{{ formatRating(game.rating) }}</span>
        <span>({{ formatNumber(game.rating_count) }})</span>
      </div>
    </div>
  </div>
</template>
