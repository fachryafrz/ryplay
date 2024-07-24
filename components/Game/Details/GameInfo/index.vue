<script setup>
import AdditionalInfo from "./AdditionalInfo.vue";

const { game, publishers, developers } = defineProps([
  "game",
  "publishers",
  "developers",
]);

const readMore = ref(false);
const storyline = ref(game.storyline || "");
const summary = ref(game.summary || "");
const combinedText = ref();
const words = ref();
const wordCount = ref();
const maxLength = 300;

const toggleReadMore = () => (readMore.value = !readMore.value);

onMounted(() => {
  combinedText.value = computed(() => {
    return `${storyline.value} ${storyline.value && summary.value ? "\n\n" : ""}${summary.value}`;
  });
  words.value = computed(() => combinedText.value.split(""));
  wordCount.value = computed(() => words.value.length);
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <section>
      <div class="prose max-w-none text-neutral-400 last:[&_p]:mb-0">
        <MDC v-if="combinedText" :value="game.storyline" />
        <MDC v-if="combinedText" :value="game.summary" />
      </div>

      <!-- <button
        @click="toggleReadMore"
        v-if="wordCount > maxLength"
        class="flex w-fit items-center gap-1 text-primary"
      >
        <span>{{ readMore ? "Read less" : "Read more" }}</span>
        <span class="material-symbols-outlined">
          {{ readMore ? "keyboard_arrow_up" : "keyboard_arrow_down" }}
        </span>
      </button> -->
    </section>

    <section class="@container">
      <AdditionalInfo :game="game" />
    </section>
  </div>
</template>
