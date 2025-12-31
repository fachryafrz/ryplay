<script setup>
import { formatNumber, formatRating } from "~/helper/formats";
import pluralize from "pluralize";

const { game, externalGames, findStoreById } = defineProps([
  "game",
  "externalGames",
  "findStoreById",
]);
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 gap-x-12 gap-y-4 rounded-xl bg-neutral p-6 outline outline-secondary @md:grid-cols-2 [&>div]:flex [&>div]:flex-col [&>div]:gap-1"
  >
    <!-- Compatible with -->
    <div v-show="game.platforms">
      <h2 class="heading-2">Compatible with</h2>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          :prefetch="false"
          v-for="platform in game.platforms"
          :key="platform.id"
          :to="`/search?platform=${platform.slug}`"
          class="btn btn-secondary btn-sm"
        >
          {{ platform.name || platform.abbreviation }}
        </NuxtLink>
      </div>
    </div>

    <!-- Available on -->
    <div v-show="externalGames?.length > 0">
      <h2 class="heading-2">Available on</h2>

      <GameDetailsInfoStores
        :game="game"
        :external-games="externalGames"
        :find-store-by-id="findStoreById"
      />
    </div>

    <!-- Genres -->
    <div v-show="game.genres?.length > 0">
      <h2 class="heading-2">
        {{ pluralize("Genre", game.genres?.length) }}
      </h2>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          :prefetch="false"
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
    <div v-show="game.rating">
      <h2 class="heading-2">Rating</h2>

      <div class="flex items-center gap-1 text-lg sm:text-2xl">
        <Icon
          name="ion:star"
          size="30"
          class="!text-xl text-yellow-500 sm:!text-3xl"
        />
        <span class="font-semibold">{{ formatRating(game.rating) }}</span>
        <span>({{ formatNumber(game.rating_count) }})</span>
      </div>
    </div>
  </div>
</template>
