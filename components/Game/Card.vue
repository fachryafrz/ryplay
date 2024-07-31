<script setup>
import gameCategory from "@/json/game-category.json";

const { game, isHorizontal } = defineProps(["game", "isHorizontal"]);
</script>

<template>
  <NuxtLink :to="`/games/${game.slug}`" class="relative">
    <div v-if="!isHorizontal">
      <figure
        class="-z-10 block aspect-poster overflow-hidden rounded-xl bg-neutral"
      >
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`"
          :alt="game.name"
          id="game-cover"
          class="h-full w-full object-cover"
        />
      </figure>

      <span class="mt-3 block text-xs font-semibold text-neutral-500">
        {{ gameCategory.find((item) => item.id === game.category).name }}
      </span>

      <h3
        class="mt-1 line-clamp-2 text-pretty font-semibold sm:text-xl sm:leading-tight"
      >
        {{ game.name }}
      </h3>
    </div>

    <div
      v-if="isHorizontal"
      class="mb-4 transition-all hocus:mb-0 hocus:rounded-xl hocus:bg-secondary hocus:p-2 md:hocus:p-4 [&_figure]:hocus:rounded-md"
    >
      <figure
        class="-z-10 block aspect-video overflow-hidden rounded-xl transition-all"
      >
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id || game.screenshots[0].image_id}.jpg`"
          :alt="game.name"
          id="game-cover"
          class="h-full w-full object-cover"
        />
      </figure>
      <!-- <div
        class="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 text-center backdrop-blur-lg before:absolute before:inset-0 before:bg-base-100 before:opacity-75"
      >
        <h3 class="z-10 text-sm font-semibold">{{ game.name }}</h3>
        <p class="line-clamp-2 text-sm text-neutral-500">
          {{ game.storyline }}
        </p>
      </div> -->
      <span class="mt-3 block text-xs font-semibold text-neutral-500">
        {{ gameCategory.find((item) => item.id === game.category).name }}
      </span>

      <h3
        class="mt-1 line-clamp-1 text-pretty font-semibold sm:text-xl sm:leading-tight"
      >
        {{ game.name }}
      </h3>

      <p class="mt-1 hidden sm:line-clamp-3 text-xs text-neutral-500 lg:text-sm">
        {{ game.storyline || game.summary }}
      </p>
    </div>
  </NuxtLink>
</template>
