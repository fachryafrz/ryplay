<script setup>
import { gameCategory } from '~/data/game-category';


const { game, isHorizontal } = defineProps(["game", "isHorizontal"]);

const category = gameCategory.find((item) => item.id === game.category).name;
</script>

<template>
  <NuxtLink :to="`/games/${game.slug}`" class="relative">
    <div
      v-if="!isHorizontal"
      :class="`after-content relative transition-all after:pointer-events-none after:absolute after:left-2 after:top-2 after:rounded after:bg-black after:bg-opacity-60 after:p-1 after:px-2 after:text-xs after:text-white after:backdrop-blur hocus:[&_img]:scale-105 hocus:[&_img]:duration-500`"
      :data-after-content="category"
    >
      <figure class="block aspect-poster overflow-hidden rounded-xl bg-neutral">
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`"
          alt=""
          :aria-hidden="true"
          id="game-cover"
          class="block h-full w-full bg-cover bg-center transition-all"
          draggable="false"
          loading="lazy"
          role="presentation"
        />
      </figure>

      <h3 :title="game.name" class="sr-only">
        {{ game.name }}
      </h3>
    </div>

    <div
      v-if="isHorizontal"
      class="after-content relative mb-4 overflow-hidden rounded-xl transition-all after:pointer-events-none after:absolute after:left-2 after:top-2 after:rounded after:bg-black after:bg-opacity-60 after:p-1 after:px-2 after:text-xs after:text-white after:backdrop-blur hocus:[&_img]:scale-105 hocus:[&_img]:duration-500"
      :data-after-content="category"
    >
      <figure class="block aspect-video overflow-hidden">
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id || game.screenshots[0].image_id}.jpg`"
          alt=""
          id="game-cover"
          draggable="false"
          class="block h-full w-full transition-all"
          loading="lazy"
          role="presentation"
          aria-hidden="true"
          @error="
            $event.target.src = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg`
          "
        />
      </figure>

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
