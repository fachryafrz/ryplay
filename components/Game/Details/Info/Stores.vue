<script setup>
const { filteredExternalGames, findStoreById } = defineProps([
  "filteredExternalGames",
  "findStoreById",
]);
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li
      v-for="externalGame in filteredExternalGames"
      :key="externalGame.category"
      v-show="externalGame.url"
    >
      <NuxtLink :to="externalGame.url" target="_blank">
        <img
          :src="`/store_icons/${findStoreById(externalGame.category).image_id}.png`"
          :alt="findStoreById(externalGame.category).store"
          class="aspect-square w-[40px] object-contain"
          draggable="false"
        />
      </NuxtLink>
    </li>
  </ul>
</template>
