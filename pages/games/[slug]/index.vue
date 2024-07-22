<script setup>
const { slug } = useRoute().params;

const game = ref([]);

onMounted(async () => {
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
});
</script>

<template>
  <div>
    <span>Game Details of {{ game.name }}</span>
  </div>
</template>
