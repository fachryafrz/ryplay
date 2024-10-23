<script setup>
const { games } = defineProps(["games"]);
</script>

<template>
  <div class="@container">
    <div
      class="grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7"
    >
      <div v-for="game in games" :key="game.slug">
        <GameCard :game="game" />
      </div>

      <slot />
    </div>
  </div>
</template>
