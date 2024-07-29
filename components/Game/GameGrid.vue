<script setup>
import GameCard from "./GameCard.vue";

const { games } = defineProps(["games"]);
</script>

<template>
  <div class="@container">
    <div
      class="grid grid-cols-3 gap-2 lg:@3xl:grid-cols-4 xl:grid-cols-4 xl:@4xl:grid-cols-5 2xl:grid-cols-5 2xl:@5xl:grid-cols-6"
    >
      <div v-for="game in games" :to="game.slug">
        <GameCard :game="game" />
      </div>
    </div>
  </div>
</template>
