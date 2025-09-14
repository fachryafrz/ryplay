<script setup>
const { games } = defineProps(["games"]);

const activeIndex = ref(0);
const windowWidth = ref(0);

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  updateWidth();
  window.addEventListener("resize", updateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidth);
});

// hitung jumlah game
const visibleGames = computed(() => {
  if (!games) return [];
  if (windowWidth.value < 1280) return games.slice(0, 8);

  const count = Math.max(4, Math.floor(windowWidth.value / 450) + 2);
  return games.slice(0, count);
});
</script>

<template>
  <div
    class="grid grid-cols-2 gap-2 overflow-auto md:grid-cols-4 xl:flex xl:flex-wrap"
  >
    <NuxtLink
      v-for="(game, index) in visibleGames"
      :key="game.slug"
      :to="`/games/${game.slug}`"
      :class="[
        'featured-games !outline-none',
        { active: activeIndex === index },
      ]"
      @mouseover="activeIndex = index"
      @focus="activeIndex = index"
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
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks?.[0]?.image_id || game.screenshots?.[0]?.image_id}.jpg`"
        />

        <div
          class="absolute inset-0 z-10 flex flex-col justify-end gap-1 text-pretty p-2 px-6 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-t before:from-base-100"
        >
          <h3
            class="line-clamp-1 text-pretty text-center text-sm font-semibold xl:text-start xl:text-xl"
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
  </div>
</template>
