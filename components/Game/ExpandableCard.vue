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
    :class="[
      'featured-games last:hidden xl:last:flex',
      {
        active: hoveredIndex === index || lastHoveredIndex === index,
      },
    ]"
    @mouseover="
      hoveredIndex = index;
      lastHoveredIndex = index;
    "
    @mouseleave="hoveredIndex = null"
    @focus="
      hoveredIndex = index;
      lastHoveredIndex = index;
    "
    @blur="hoveredIndex = null"
  >
    <img
      :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg`"
      alt=""
      id="game-cover"
    />

    <div
      id="game-screenshot"
      class="absolute inset-0 opacity-0 transition-opacity duration-700"
    >
      <img
        class="tra"
        :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id || game.screenshots[0].image_id}.jpg`"
      />

      <div
        class="absolute inset-0 z-10 flex flex-col justify-end gap-1 text-pretty p-2 px-6 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-t before:from-base-100"
      >
        <h3
          class="line-clamp-1 text-pretty text-center text-sm font-semibold lg:text-start lg:text-xl"
        >
          {{ game.name }}
        </h3>
        <span
          class="before-content line-clamp-2 text-pretty text-sm text-neutral-300 xl:max-w-[80%]"
          :data-before-content="game.storyline || game.summary"
        />
      </div>
    </div>
  </NuxtLink>
</template>
