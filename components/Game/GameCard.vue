<script setup>
const { game, isHorizontal } = defineProps(["game", "isHorizontal"]);
</script>

<template>
  <NuxtLink :to="`/games/${game.slug}`" class="relative">
    <div v-if="!isHorizontal">
      <figure class="-z-10 block aspect-poster overflow-hidden rounded-xl">
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`"
          :alt="game.name"
          id="game-cover"
          class="h-full w-full object-cover"
        />
      </figure>
    </div>

    <div v-if="isHorizontal">
      <figure class="-z-10 block aspect-video overflow-hidden rounded-xl">
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id}.jpg`"
          :alt="game.name"
          id="game-cover"
          class="h-full w-full object-cover"
        />
      </figure>
      <div
        class="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 text-center backdrop-blur-lg before:absolute before:inset-0 before:bg-base-100 before:opacity-75"
      >
        <h3 class="z-10 text-sm font-semibold">{{ game.name }}</h3>
        <!-- <p class="line-clamp-2 text-sm text-neutral-500">
          {{ game.storyline }}
        </p> -->
      </div>
    </div>
  </NuxtLink>
</template>
