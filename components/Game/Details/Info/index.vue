<script setup>
import stores from "@/json/store-category.json";

const { game } = defineProps(["game"]);

const readMore = ref(false);
const storyline = ref(game.storyline || "");
const summary = ref(game.summary || "");
const combinedText = ref(
  `${storyline.value} ${storyline.value && summary.value ? "\n\n" : ""} ${summary.value}`,
);
const words = ref(combinedText.value.split(""));
const wordCount = ref(words.value.length);
const maxLength = 500;

const toggleReadMore = () => {
  readMore.value = !readMore.value;
};

// Fungsi untuk mendapatkan store berdasarkan ID category
const findStoreById = (category) => {
  return stores.find((store) => store.id === category) || {};
};

// Fungsi untuk memeriksa apakah ada image_id
const hasImageId = (category) => {
  const store = findStoreById(category);
  return store.image_id && store.image_id.trim() !== "";
};

// Memfilter game.external_games untuk hanya item dengan image_id yang valid
const uniqueExternalGames = game.external_games.filter(
  (item, index, self) =>
    self.findIndex((t) => t.category === item.category) === index,
);

// const filteredExternalGames = game.external_games?.filter((externalGame) =>
//   hasImageId(externalGame.category),
// );

const filteredExternalGames = uniqueExternalGames.filter((externalGame) =>
  hasImageId(externalGame.category),
);

const hasURLExternalGames = filteredExternalGames.filter((item) => item.url);

console.log(game.external_games);
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
        <MDC
          v-if="combinedText"
          :value="
            readMore || wordCount < maxLength
              ? combinedText
              : `${combinedText.slice(0, maxLength)}...`
          "
        />
      </div>

      <button
        @click="toggleReadMore"
        v-if="wordCount > maxLength"
        class="flex w-fit items-center gap-1 text-primary"
      >
        <span>{{ readMore ? "Read less" : "Read more" }}</span>
        <Icon
          :name="
            readMore ? 'ion:chevron-up-outline' : 'ion:chevron-down-outline'
          "
          size="20"
        />
      </button>
    </section>

    <!-- Additional Info -->
    <section
      class="@container"
      v-if="
        game.platforms ||
        hasURLExternalGames?.length > 0 ||
        game.genres ||
        game.rating
      "
    >
      <GameDetailsInfoAdditionalInfo
        :game="game"
        :external-games="hasURLExternalGames"
        :find-store-by-id="findStoreById"
      />
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
          :games="
            collection.games
              .filter((game) => game.category === 0)
              .sort((a, b) => a.first_release_date - b.first_release_date)
          "
        />
      </div>
    </div>
  </div>
</template>
