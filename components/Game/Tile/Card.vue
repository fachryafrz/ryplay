<script setup>
import gameCategory from "@/json/game-category.json";

const { game } = defineProps(["game"]);

const category = gameCategory.find((item) => item.id === game.category).name;
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

    <div
      class="game-card relative w-full before:text-xs before:font-semibold before:text-neutral-500 after:mt-1 after:line-clamp-2 after:text-xs after:font-semibold after:text-neutral-500"
      :data-before-content="category"
      :data-after-content="game.storyline || game.summary"
    >
      <h3 class="line-clamp-2 text-pretty font-semibold leading-tight">
        {{ game.name }}
      </h3>
    </div>
  </NuxtLink>
</template>
