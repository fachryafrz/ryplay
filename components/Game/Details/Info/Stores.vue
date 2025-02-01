<script setup>
const { externalGames, findStoreById } = defineProps([
  "externalGames",
  "findStoreById",
]);

const handleOpenWindow = async (url) => {
  // NOTE: Already tried the documentPictureInPicture with iframe but it doesn't work, because most of the website refuse to be embeded in iframe

  const windowFeatures = `left=${screen.width},top=${screen.height},width=${1200},height=${600},noreferrer,noopener`;

  window.open(url, "gameStoreWindow", windowFeatures);

  return;
};
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
