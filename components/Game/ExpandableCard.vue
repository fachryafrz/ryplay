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
    class="min-w-fit overflow-hidden rounded-xl last:hidden 2xl:last:flex"
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
    <figure
      :class="[
        'featured-games',
        { active: hoveredIndex === index || lastHoveredIndex === index },
      ]"
    >
      <img
        :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg`"
        :alt="game.name"
        id="game-cover"
        class="h-full w-full object-cover transition-all"
        draggable="false"
        loading="lazy"
      />
      <div
        id="game-screenshot"
        class="absolute inset-0 opacity-0 transition-opacity duration-700"
      >
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id || game.screenshots[0].image_id}.jpg`"
          :alt="game.name"
          class="h-full w-full object-cover"
          draggable="false"
          loading="lazy"
        />

        <div
          class="absolute inset-0 z-10 flex flex-col justify-end gap-1 text-pretty p-2 px-6 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-t before:from-base-100"
        >
          <h3
            class="line-clamp-1 text-pretty text-center text-sm font-semibold lg:text-start lg:text-xl"
          >
            {{ game.name }}
          </h3>
          <p
            class="line-clamp-2 text-pretty text-sm text-neutral-300 xl:max-w-[80%]"
          >
            {{ game.storyline || game.summary }}
          </p>
        </div>
      </div>
    </figure>
  </NuxtLink>
</template>
