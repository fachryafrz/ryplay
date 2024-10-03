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
      :title="findStoreById(externalGame.category).store"
    >
      <NuxtLink :to="externalGame?.url" target="_blank">
        <figure
          :style="`background-image: url('/store_icons/${findStoreById(externalGame.category).image_id}.png');`"
          :title="findStoreById(externalGame.category).store"
          class="aspect-square w-[40px] bg-contain bg-center bg-no-repeat"
          draggable="false"
        ></figure>
        <span class="sr-only">
          {{ `Buy at ${findStoreById(externalGame.category).store}` }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>
