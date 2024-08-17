<script setup>
import { formatNumber, formatRating } from "~/helper/formats";
import stores from "@/json/store-category.json";
import { isPlural } from "~/helper/isPlural";

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
const filteredExternalGames = game.external_games?.filter((externalGame) =>
  hasImageId(externalGame.category),
);
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 gap-x-12 gap-y-4 rounded-xl bg-neutral p-6 outline outline-secondary @md:grid-cols-2 [&>div]:flex [&>div]:flex-col [&>div]:gap-1"
  >
    <!-- Compatible with -->
    <div v-if="game.platforms">
      <h2 class="heading-2">Compatible with</h2>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="platform in game.platforms"
          :key="platform.id"
          :to="`/search?platform=${platform.slug}`"
          class="btn btn-secondary btn-sm"
        >
          {{ platform.name || platform.abbreviation }}
        </NuxtLink>
      </div>
    </div>

    <!-- Available in -->
    <div v-if="filteredExternalGames?.length > 0">
      <h2 class="heading-2">Available in</h2>

      <GameDetailsInfoStores
        :filtered-external-games="filteredExternalGames"
        :find-store-by-id="findStoreById"
      />
    </div>

    <!-- Genres -->
    <div v-if="game.genres">
      <h2 class="heading-2">
        {{ isPlural(game.genres.length, `Genre`, `Genres`) }}
      </h2>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="genre in game.genres"
          :key="genre.id"
          :to="`/search?genre=${genre.slug}`"
          class="btn btn-secondary btn-sm"
        >
          {{ genre.name }}
        </NuxtLink>
      </div>
    </div>

    <!-- Ratings -->
    <div v-if="game.rating">
      <h2 class="heading-2">Rating</h2>

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
