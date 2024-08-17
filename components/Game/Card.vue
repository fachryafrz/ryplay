<script setup>
import gameCategory from "@/json/game-category.json";

const { game, isHorizontal } = defineProps(["game", "isHorizontal"]);
</script>

<template>
  <NuxtLink :to="`/games/${game.slug}`" class="relative">
    <div
      v-if="!isHorizontal"
      class="relative transition-all hocus:[&_img]:scale-105 hocus:[&_img]:duration-500"
    >
      <figure
        class="-z-10 block aspect-poster overflow-hidden rounded-xl bg-neutral"
      >
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`"
          :alt="game.name"
          id="game-cover"
          class="h-full w-full object-cover transition-all"
        />
      </figure>

      <span
        class="absolute left-2 top-2 rounded bg-black bg-opacity-60 p-1 px-2 text-xs text-white backdrop-blur"
      >
        {{ gameCategory.find((item) => item.id === game.category).name }}
      </span>

      <h3 :title="game.name" class="sr-only">
        {{ game.name }}
      </h3>
    </div>

    <div
      v-if="isHorizontal"
      class="relative mb-4 overflow-hidden rounded-xl transition-all hocus:[&_img]:scale-105 hocus:[&_img]:duration-500"
    >
      <figure class="-z-10 block aspect-video overflow-hidden">
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id || game.screenshots[0].image_id}.jpg`"
          :alt="game.name"
          id="game-cover"
          class="h-full w-full object-cover transition-all"
        />
      </figure>

      <span
        class="absolute left-2 top-2 rounded bg-black bg-opacity-60 p-1 px-2 text-xs text-white backdrop-blur"
      >
        {{ gameCategory.find((item) => item.id === game.category).name }}
      </span>

      <div
        class="pointer-events-none absolute inset-0 hidden flex-col justify-end p-4 before:absolute before:inset-0 before:z-0 before:bg-gradient-to-t before:from-base-100 before:opacity-95 md:flex [&_*]:z-10"
      >
        <h3 class="line-clamp-1 font-semibold text-white lg:text-xl">
          {{ game.name }}
        </h3>

        <!-- <p class="line-clamp-2 max-w-[80%] text-sm text-neutral-400">
          {{ game.storyline || game.summary }}
        </p> -->
      </div>
    </div>
  </NuxtLink>
</template>
