<script setup>
import { formatNumber, formatRating } from "~/helper/formats";
import GameStores from "./GameStores.vue";
import stores from "@/json/store-category.json";

const { game } = defineProps(["game"]);

// Fungsi untuk mendapatkan store berdasarkan ID category
const findStoreById = (category) => {
  return stores.find((store) => store.id === category) || {};
};

// Fungsi untuk memeriksa apakah ada image_id
const hasImageId = (category) => {
  const store = findStoreById(category);
  return store.image_id && store.image_id.trim() !== "";
};

// Memfilter game.external_games untuk hanya item dengan image_id yang valid
const filteredExternalGames = game.external_games.filter((externalGame) =>
  hasImageId(externalGame.category),
);
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 gap-x-12 gap-y-4 rounded-xl bg-neutral p-6 outline outline-secondary @md:grid-cols-2"
  >
    <!-- Compatible with -->
    <div v-if="game.platforms">
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
    <div v-if="filteredExternalGames.length > 0">
      <h2 class="heading-2">Available in</h2>

      <GameStores
        :filtered-external-games="filteredExternalGames"
        :find-store-by-id="findStoreById"
      />
    </div>

    <!-- Genres -->
    <div v-if="game.genres">
      <h2 class="heading-2">Genres</h2>

      <div class="flex flex-wrap gap-2">
        <div v-for="genre in game.genres" class="btn btn-secondary btn-sm">
          {{ genre.name }}
        </div>
      </div>
    </div>

    <!-- Ratings -->
    <div v-if="game.rating">
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
