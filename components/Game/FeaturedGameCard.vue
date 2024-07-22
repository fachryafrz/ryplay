<script setup>
const featuredGames = ref([]);
const hoveredIndex = ref(null);
const lastHoveredIndex = ref(0);

try {
  const response = await $fetch("/api/games/featured");

  featuredGames.value = response;
} catch (error) {
  console.error("Failed to fetch games:", error);
}
</script>

<template>
  <NuxtLink
    v-for="(game, index) in featuredGames"
    :key="game.slug"
    :to="`/games/${game.slug}`"
  >
    <figure
      :class="[
        'featured-games',
        { active: hoveredIndex === index || lastHoveredIndex === index },
      ]"
      @mouseover="
        hoveredIndex = index;
        lastHoveredIndex = index;
      "
      @mouseleave="hoveredIndex = null"
    >
      <img
        :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg`"
        :alt="game.name"
        id="game-cover"
        class="h-full w-full object-cover transition-all"
      />
      <div
        id="game-screenshot"
        class="absolute inset-0 opacity-0 transition-opacity duration-700 before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 before:via-base-100 before:via-35% before:opacity-90"
        :class="{
          'opacity-100': hoveredIndex === index || lastHoveredIndex === index,
        }"
      >
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id}.jpg`"
          :alt="game.name"
          class="h-full w-full object-cover"
        />

        <div
          class="absolute inset-0 z-10 flex max-w-[75%] flex-col justify-end gap-1 text-pretty p-4 px-6"
        >
          <h3 class="text-xl font-semibold">{{ game.name }}</h3>
          <p class="line-clamp-3 text-xs text-neutral-400">
            {{ game.storyline || game.summary }}
          </p>
        </div>
      </div>
    </figure>
  </NuxtLink>
</template>
