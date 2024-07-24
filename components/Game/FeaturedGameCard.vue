<script setup>
const { games } = defineProps(["games"]);

const hoveredIndex = ref(null);
const lastHoveredIndex = ref(0);
</script>

<template>
  <NuxtLink
    v-for="(game, index) in games"
    :key="game.slug"
    :to="`/games/${game.slug}`"
    class="rounded-xl overflow-hidden"
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
      >
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id || game.screenshots[0].image_id}.jpg`"
          :alt="game.name"
          class="h-full w-full object-cover"
        />

        <div
          class="absolute inset-0 z-10 flex flex-col justify-end gap-1 text-pretty p-4 px-6 lg:max-w-[75%]"
        >
          <h3
            class="text-pretty text-center text-sm font-semibold lg:text-start lg:text-xl"
          >
            {{ game.name }}
          </h3>
          <p
            class="hidden text-pretty text-xs font-medium text-neutral-500 lg:line-clamp-3"
          >
            {{ game.storyline || game.summary }}
          </p>
        </div>
      </div>
    </figure>
  </NuxtLink>
</template>
