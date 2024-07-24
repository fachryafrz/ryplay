<script setup>
import stores from "@/json/store-category.json";

const { game } = defineProps(["game"]);

// Fungsi untuk mendapatkan store berdasarkan ID category
const findStoreById = (category) => {
  return stores.find((store) => store.id === category) || {};
};

// Fungsi untuk memeriksa apakah ada image_id
const hasImageId = (category) => {
  const store = findStoreById(category);
  return store.image_id && store.image_id.trim() !== "";
};

// Memfilter game.external_games untuk hanya item dengan image_id yang valid
const filteredExternalGames = game.external_games.filter((externalGame) =>
  hasImageId(externalGame.category),
);
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li
      v-for="externalGame in filteredExternalGames"
      :key="externalGame.category"
    >
      <NuxtLink :to="externalGame.url" target="_blank">
        <img
          :src="`/store_icons/${findStoreById(externalGame.category).image_id}.png`"
          :alt="findStoreById(externalGame.category).store"
          class="aspect-square w-[40px] object-contain"
        />
      </NuxtLink>
    </li>
  </ul>
</template>
