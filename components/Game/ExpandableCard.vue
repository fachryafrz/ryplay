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
      <span
        :style="`background-image: url('https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg');`"
        :aria-label="game.name"
        id="game-cover"
        class="block h-full w-full bg-cover bg-center transition-all"
        draggable="false"
      ></span>
      <div
        id="game-screenshot"
        class="absolute inset-0 opacity-0 transition-opacity duration-700"
      >
        <span
          :style="`background-image: url('https://images.igdb.com/igdb/image/upload/t_720p/${game.screenshots[0].image_id}.jpg');`"
          :aria-label="game.name"
          class="block h-full w-full bg-cover bg-center"
          draggable="false"
        ></span>

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
    </figure>
  </NuxtLink>
</template>
