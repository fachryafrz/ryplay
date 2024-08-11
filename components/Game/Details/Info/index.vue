<script setup>
const { game } = defineProps(["game"]);

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
    <h1 class="mt-4 text-pretty text-center text-3xl font-bold">
      {{ game.name }}
    </h1>

    <!-- Countdown -->
    <GameDetailsInfoCountdown :game="game" />

    <!-- About -->
    <section>
      <div class="prose -my-4 max-w-none text-neutral-400">
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

    <!-- Additional Info -->
    <section
      class="@container"
      v-if="
        game.platforms ||
        game.external_games?.length > 0 ||
        game.genres ||
        game.rating
      "
    >
      <GameDetailsInfoAdditionalInfo :game="game" />
    </section>

    <!-- DLC -->
    <div v-if="game.dlcs?.length > 0" class="">
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">DLC</h2>
          <p class="text-sm text-neutral-500">
            Additional content for {{ game.name }}
          </p>
        </div>
        <GameGrid :games="game.dlcs" />
      </div>
    </div>

    <!-- Expansions (2) -->

    <!-- Bundles -->
    <div v-if="game.bundles?.length > 0" class="">
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Bundles</h2>
          <p class="text-sm text-neutral-500">
            Games that are bundled together
          </p>
        </div>
        <GameGrid :games="game.bundles" />
      </div>
    </div>

    <!-- Standalone Expansion (4) -->

    <!-- Mods (5) -->

    <!-- Episodes (6) -->

    <!-- Seasons (7) -->

    <!-- Remake (8) -->

    <!-- Remaster (9) -->

    <!-- Expanded Version (10) -->

    <!-- Port (11) -->

    <!-- Fork (12) -->

    <!-- Game Packs (13) -->

    <!-- Updates (14) -->

    <!-- Collection -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 0),
        )
      "
      v-for="collection in game.collections"
      :key="collection.id"
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">{{ collection.name }} Collection</h2>
          <p class="text-sm text-neutral-500">
            Discover games that are part of {{ game.name }}
          </p>
        </div>
        <GameGrid
          :games="collection.games.filter((game) => game.category === 0)"
        />
      </div>
    </div>
  </div>
</template>
