<script setup>
import AdditionalInfo from "./AdditionalInfo.vue";
import Countdown from "./Countdown.vue";

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
    <!-- Countdown -->
    <Countdown :game="game" />

    <!-- About -->
    <section>
      <div class="mb-2">
        <h2 class="heading-2">About</h2>
      </div>

      <div class="prose max-w-none text-neutral-400 last:[&_p]:mb-0">
        <MDC
          v-if="combinedText"
          :value="game.storyline"
          class="first:[&_p]:mt-0"
        />
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

    <!-- Additional Info -->
    <section class="@container">
      <AdditionalInfo :game="game" />
    </section>
  </div>
</template>
