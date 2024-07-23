<script setup>
import GameInfo from "~/components/Game/Details/GameInfo/index.vue";
import GameMedia from "~/components/Game/Details/GameMedia.vue";
import SimilarGames from "~/components/Game/Details/SimilarGames.vue";

const { slug } = useRoute().params;

const game = ref([]);

try {
  const response = await $fetch("/api/games/details", {
    params: {
      slug: slug,
    },
  });

  const data = response[0];
  game.value = data;
} catch (error) {
  console.error("Failed to fetch games:", error);
}
</script>

<template>
  <div class="flex flex-col gap-28">
    <GameMedia :game="game" />

    <GameInfo :game="game" />

    <SimilarGames :game="game" />
  </div>
</template>
