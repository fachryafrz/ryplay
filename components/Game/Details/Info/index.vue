<script setup>
import stores from "@/json/store-category.json";

const { game } = defineProps(["game"]);

const readMore = ref(false);
const storyline = ref(game.storyline || "");
const summary = ref(game.summary || "");
const combinedText = ref(
  `${storyline.value} ${storyline.value && summary.value ? "\n\n" : ""} ${summary.value}`,
);
// const words = ref(combinedText.value.split("")); DEPRECATED
// const wordCount = ref(words.value.length); DEPRECATED
// const maxLength = 750; DEPRECATED

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
const uniqueExternalGames = game.external_games?.filter(
  (item, index, self) =>
    self.findIndex((t) => t.category === item.category) === index,
);

const filteredExternalGames = uniqueExternalGames?.filter((externalGame) =>
  hasImageId(externalGame.category),
);

const IGDB = {
  url: `https://www.igdb.com/games/${game.slug}`,
  category: 0,
};

const includeIGDB = filteredExternalGames
  ? [IGDB, ...filteredExternalGames]
  : [IGDB];
</script>

<template>
  <div class="flex flex-col gap-6 @container">
    <h1 class="mt-4 text-pretty text-center text-3xl font-bold">
      {{ game.name }}
    </h1>

    <!-- Countdown -->
    <GameDetailsInfoCountdown :game="game" />

    <!-- About -->
    <section>
      <div class="prose -my-4 max-w-none text-neutral-400">
        <MDC :value="combinedText" />
      </div>
    </section>

    <!-- Additional Info -->
    <section
      class="@container"
      v-if="game.platforms || game.genres || game.rating"
    >
      <GameDetailsInfoAdditionalInfo
        :game="game"
        :external-games="includeIGDB"
        :find-store-by-id="findStoreById"
      />
    </section>

    <!-- Live Streaming -->
    <GameDetailsInfoStreaming :external-games="includeIGDB" />

    <!-- DLC -->
    <div v-if="game.dlcs?.length > 0" class="">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">DLC</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2': game.dlcs.length > 1,
              '@4xl:grid-cols-3': game.dlcs.length > 2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in game.dlcs"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>
      </div>
    </div>

    <!-- Expansions (2) -->
    <div v-if="game.expansions?.length > 0" class="">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Expansions</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2': game.expansions.length > 1,
              '@4xl:grid-cols-3': game.expansions.length > 2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in game.expansions"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>
      </div>
    </div>

    <!-- Bundles -->
    <div v-if="game.bundles?.length > 0" class="">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Bundles</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2': game.bundles.length > 1,
              '@4xl:grid-cols-3': game.bundles.length > 2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in game.bundles"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>
      </div>
    </div>

    <!-- Standalone Expansion (4) -->
    <div v-if="game.standalone_expansions?.length > 0" class="">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Standalone Expansion</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2': game.standalone_expansions.length > 1,
              '@4xl:grid-cols-3': game.standalone_expansions.length > 2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in game.standalone_expansions"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>
      </div>
    </div>

    <!-- Remakes (8) -->
    <div v-if="game.remakes?.length > 0" class="">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Remakes</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2': game.remakes.length > 1,
              '@4xl:grid-cols-3': game.remakes.length > 2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in game.remakes"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>
      </div>
    </div>

    <!-- Remasters (9) -->
    <div v-if="game.remasters?.length > 0" class="">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Remasters</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2': game.remasters.length > 1,
              '@4xl:grid-cols-3': game.remasters.length > 2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in game.remasters"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>
      </div>
    </div>

    <!-- Ports (11) -->
    <div v-if="game.ports?.length > 0" class="">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Ports</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2': game.ports.length > 1,
              '@4xl:grid-cols-3': game.ports.length > 2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in game.ports"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>
      </div>
    </div>

    <!-- Forks (12) -->
    <div v-if="game.forks?.length > 0" class="">
      <div class="flex flex-col gap-2">
        <h2 class="heading-2">Forks</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2': game.forks.length > 1,
              '@4xl:grid-cols-3': game.forks.length > 2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in game.forks"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>
      </div>
    </div>

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
        <h2 class="heading-2">{{ collection.name }} Collection</h2>

        <div
          :class="[
            '-ml-2 grid',
            {
              '@xl:grid-cols-2':
                collection.games?.filter((game) => game.category === 0).length >
                1,
              '@4xl:grid-cols-3':
                collection.games?.filter((game) => game.category === 0).length >
                2,
            },
          ]"
        >
          <GameTileCard
            v-for="game in collection.games
              ?.filter((game) => game.category === 0)
              .sort((a, b) => a.first_release_date - b.first_release_date)"
            :key="game.slug"
            :game="game"
            :show-category="false"
          />
        </div>

        <!-- <GameGrid
          :games="
            collection.games
              ?.filter((game) => game.category === 0)
              .sort((a, b) => a.first_release_date - b.first_release_date)
          "
        /> -->
      </div>
    </div>
  </div>
</template>
