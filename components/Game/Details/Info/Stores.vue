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
        className="tooltip tooltip-secondary tooltip-bottom"
        :data-tip="findStoreById(externalGame.category).store"
      >
        <button @click="handleOpenWindow(externalGame.url)">
          <img
            :src="`/store_icons/${findStoreById(externalGame.category).image_id}.png`"
            :alt="''"
            class="aspect-square w-[40px] object-contain"
            draggable="false"
            loading="lazy"
            role="presentation"
            aria-hidden="true"
          />
        </button>
      </div>
    </li>
  </ul>
</template>
