<script setup>
const { game } = defineProps(["game"]);
</script>

<template>
  <div class="relative">
    <figure class="aspect-poster -z-10 block overflow-hidden rounded-xl">
      <img
        :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg`"
        :alt="game.name"
        id="game-cover"
        class="h-full w-full object-cover"
      />
    </figure>
    <!-- <div class="absolute inset-0 flex h-full flex-col justify-end">
      <h3 class="text-xl font-medium">{{ game.name }}</h3>
      <p class="line-clamp-2 text-sm text-neutral-500">{{ game.storyline }}</p>
    </div> -->
  </div>
</template>
