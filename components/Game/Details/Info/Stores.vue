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
        className="tooltip tooltip-secondary tooltip-bottom before:hidden sm:before:block"
        :data-tip="findStoreById(externalGame.category).store"
      >
        <button @click="handleOpenWindow(externalGame.url)">
          <img
            :src="`/store_icons/${findStoreById(externalGame.category).image_id}.png`"
            :alt="''"
            class="aspect-square w-[50px] object-contain"
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
