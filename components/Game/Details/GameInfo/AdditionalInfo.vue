<script setup>
import { formatNumber, formatRating } from "~/helper/formats";

const { game } = defineProps(["game"]);
</script>

<template>
  <div class="grid grid-cols-1 @md:grid-cols-2 gap-4 gap-y-4 gap-x-12 rounded-2xl bg-secondary p-6">
    <!-- Compatible with -->
    <div>
      <h2 class="mb-2 text-xl font-semibold">Compatible with</h2>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="platform in game.platforms"
          class="flex flex-col items-center rounded-md bg-neutral p-2 text-start text-sm font-semibold"
        >
          {{ platform.abbreviation }}
        </div>
      </div>
    </div>

    <!-- Ratings -->
    <div>
      <h2 class="mb-2 text-xl font-semibold">Ratings</h2>

      <div class="flex items-center gap-1 text-lg sm:text-2xl">
        <span class="material-symbols-outlined fill !text-xl sm:!text-3xl"> star </span>
        <span class="font-semibold">{{ formatRating(game.rating) }}</span>
        <span>({{ formatNumber(game.rating_count) }})</span>
      </div>
    </div>

    <!-- Genres -->
    <div>
      <h2 class="mb-2 text-xl font-semibold">Genres</h2>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="genre in game.genres"
          class="flex flex-col items-center rounded-md bg-neutral p-2 text-start text-sm font-semibold"
        >
          {{ genre.name }}
        </div>
      </div>
    </div>

    <!-- Install size -->
    <div>
      <h2 class="mb-2 text-xl font-semibold">Install size</h2>
    </div>
  </div>
</template>
