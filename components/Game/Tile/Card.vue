<script setup>
import { gameCategory } from "~/data/game-category";

const {
  num,
  game,
  showCategory = true,
  showDescription = true,
} = defineProps(["num", "game", "showCategory", "showDescription"]);

const category = gameCategory.find((item) => item.id === game.category).name;
</script>

<template>
  <NuxtLink
    :to="`/games/${game.slug}`"
    class="flex items-center gap-2 rounded-xl p-2 outline-none transition-all hocus:bg-secondary"
  >
    <span
      v-if="num"
      class="w-5 text-center text-sm font-semibold text-neutral-500"
    >
      {{ num }}
    </span>

    <figure
      class="block aspect-poster w-[80px] overflow-hidden rounded-md bg-neutral"
    >
      <img
        :src="`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover?.image_id}.jpg`"
        alt=""
        role="presentation"
        aria-hidden="true"
        draggable="false"
        class="block h-full w-full bg-cover bg-center"
        loading="lazy"
      />
    </figure>

    <div
      class="before-content after-content relative w-full flex-1 before:text-xs before:font-semibold before:text-neutral-500 after:mt-1 after:line-clamp-2 after:text-xs after:font-semibold after:text-neutral-500"
      :class="[
        { 'before:hidden': !showCategory, 'after:hidden': !showDescription },
      ]"
      :data-before-content="category"
      :data-after-content="game.storyline || game.summary"
    >
      <h3 class="line-clamp-2 text-pretty font-semibold leading-tight">
        {{ game.name }}
      </h3>
    </div>
  </NuxtLink>
</template>
