<script setup>
import GameMedia from '~/components/Game/Details/GameMedia.vue';

const { slug } = useRoute().params;

const game = ref([]);

try {
  const response = await $fetch("/api/games/details", {
    params: {
      slug: slug,
    },
  });

  game.value = response[0];
} catch (error) {
  console.error("Failed to fetch games:", error);
}
</script>

<template>
  <div>
    <GameMedia :game="game" />
  </div>
</template>
