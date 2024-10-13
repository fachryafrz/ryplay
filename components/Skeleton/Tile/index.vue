<script setup>
const ITEM_COUNT = 5;
const loadingClass = "animate-pulse bg-gray-400 bg-opacity-20";
</script>

<template>
  <section class="my-2 lg:my-8">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <div>
        <span :class="`block h-7 w-32 rounded ${loadingClass}`"></span>

        <div class="mt-2">
          <SkeletonTileCard v-for="item in ITEM_COUNT" :key="item" />
        </div>
      </div>

      <div class="lg:flex lg:justify-center">
        <span class="divider flex-shrink lg:divider-horizontal"></span>
      </div>

      <div>
        <span :class="`block h-7 w-32 rounded ${loadingClass}`"></span>

        <div class="mt-2">
          <SkeletonTileCard v-for="item in ITEM_COUNT" :key="item" />
        </div>
      </div>

      <div class="lg:flex lg:justify-center">
        <span class="divider flex-shrink lg:divider-horizontal"></span>
      </div>

      <div>
        <span :class="`block h-7 w-32 rounded ${loadingClass}`"></span>

        <div class="mt-2">
          <SkeletonTileCard v-for="item in ITEM_COUNT" :key="item" />
        </div>
      </div>
    </div>
  </section>
</template>
