<script setup>
const { games, title, seeAll } = defineProps(["games", "title", "seeAll"]);
</script>

<template>
  <div>
    <NuxtLink
      :to="seeAll || `/`"
      class="flex max-w-fit items-center gap-1 [&_.iconify]:hocus:translate-x-1"
    >
      <h2 class="heading-2">{{ title }}</h2>
      <Icon name="ion:ios-arrow-forward" size="25" class="transition-all" />
    </NuxtLink>

    <div class="mt-2">
      <GameTileCard v-for="game in games" :game="game" />
    </div>
  </div>
</template>
