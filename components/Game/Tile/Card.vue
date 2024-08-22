<script setup>
import gameCategory from "@/json/game-category.json";

const { game } = defineProps(["game"]);
</script>

<template>
  <NuxtLink
    :to="`/games/${game.slug}`"
    class="flex items-center gap-2 rounded-xl p-2 outline-none transition-all hocus:bg-secondary"
  >
    <figure
      class="block aspect-poster w-[100px] overflow-hidden rounded-md bg-neutral"
    >
      <img
        :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`"
        :alt="game.name"
        id="game-cover"
        class="h-full w-full object-cover"
        draggable="false"
        loading="lazy"
      />
    </figure>

    <div class="w-full">
      <span class="block text-xs font-semibold text-neutral-500">
        {{ gameCategory.find((item) => item.id === game.category).name }}
      </span>

      <h3 class="line-clamp-2 text-pretty font-semibold leading-tight">
        {{ game.name }}
      </h3>

      <p class="mt-1 line-clamp-2 text-xs font-semibold text-neutral-500">
        {{ game.storyline || game.summary }}
      </p>
    </div>
  </NuxtLink>
</template>
