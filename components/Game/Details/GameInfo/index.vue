<script setup>
import AdditionalInfo from "./AdditionalInfo.vue";

const { game, publishers, developers } = defineProps([
  "game",
  "publishers",
  "developers",
]);

const readMore = ref(false);

const toggleReadMore = () => (readMore.value = !readMore.value);
</script>

<template>
  <div class="flex flex-col gap-4">
    <section>
      <div
        class="prose max-w-none text-neutral-400 last:[&_p]:mb-0"
        :class="{
          'line-clamp-5': !readMore,
        }"
      >
        <MDC :value="game.storyline" v-if="game.storyline" />

        <MDC :value="game.summary" v-if="game.summary" />
      </div>

      <button
        @click="toggleReadMore"
        class="flex w-fit items-center gap-1 text-primary"
      >
        <span>{{ readMore ? "Read less" : "Read more" }}</span>
        <span class="material-symbols-outlined">
          {{ readMore ? "keyboard_arrow_up" : "keyboard_arrow_down" }}
        </span>
      </button>
    </section>

    <section>
      <AdditionalInfo :game="game" />
    </section>
  </div>
</template>
