<script setup>
import GameCard from "./GameCard.vue";

const { games } = defineProps(["games"]);
</script>

<template>
  <div
    class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5"
  >
    <NuxtLink v-for="game in games" :to="game.slug">
      <GameCard :game="game" />
    </NuxtLink>
  </div>
</template>
