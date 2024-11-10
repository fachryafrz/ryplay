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
        :src="`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover?.image_id}.jpg`"
        :srcset="`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover?.image_id}.jpg 100w`"
        sizes="100vw"
        alt=""
        role="presentation"
        aria-hidden="true"
        draggable="false"
        class="block h-full w-full bg-cover bg-center"
        loading="lazy"
      />
    </figure>

    <div
      class="before-content after-content relative w-full before:text-xs before:font-semibold before:text-neutral-500 after:mt-1 after:line-clamp-2 after:text-xs after:font-semibold after:text-neutral-500"
      :data-before-content="category"
      :data-after-content="game.storyline || game.summary"
    >
      <h3 class="line-clamp-2 text-pretty font-semibold leading-tight">
        {{ game.name }}
      </h3>
    </div>
  </NuxtLink>
</template>
