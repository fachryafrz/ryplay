<script setup>
const { externalGames, findStoreById } = defineProps([
  "externalGames",
  "findStoreById",
]);
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li v-for="externalGame in externalGames" :key="externalGame.category">
      <div
        className="tooltip tooltip-bottom"
        :data-tip="findStoreById(externalGame.category).store"
      >
        <NuxtLink :to="externalGame?.url" target="_blank">
          <img
            :src="`/store_icons/${findStoreById(externalGame.category).image_id}.png`"
            :alt="''"
            class="aspect-square w-[40px] object-contain"
            draggable="false"
            loading="lazy"
            role="presentation"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </li>
  </ul>
</template>
