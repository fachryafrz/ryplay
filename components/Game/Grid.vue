<script setup>
const { games } = defineProps(["games"]);
</script>

<template>
  <div class="@container">
    <div
      class="grid grid-cols-3 gap-2 gap-y-4 md:grid-cols-4 xl:grid-cols-4 xl:@4xl:grid-cols-5 2xl:grid-cols-5 2xl:@5xl:grid-cols-6"
    >
      <div v-for="game in games" :key="game.slug" :to="game.slug">
        <GameCard :game="game" />
      </div>
    </div>
  </div>
</template>
