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
      <h2 class="heading-2 sr-only">About</h2>

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
    <section
      class="@container"
      v-if="
        game.platforms ||
        game.external_games?.length > 0 ||
        game.genres ||
        game.rating
      "
    >
      <AdditionalInfo :game="game" />
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

    <!-- Expansions -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 2),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Expansions</h2>
          <p class="text-sm text-neutral-500">
            Enhance your experience with {{ game.name }} expansions
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 2)"
        />
      </div>
    </div>

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

    <!-- Standalone Expansion -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 4),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Standalone Expansion</h2>
          <p class="text-sm text-neutral-500">Play without the base game</p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 4)"
        />
      </div>
    </div>

    <!-- Mods -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 5),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Mods</h2>
          <p class="text-sm text-neutral-500">
            Enhance your gameplay with mods
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 5)"
        />
      </div>
    </div>

    <!-- Episodes -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 6),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Episodes</h2>
          <p class="text-sm text-neutral-500">
            Play individual episodes of {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 6)"
        />
      </div>
    </div>

    <!-- Seasons -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 7),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Seasons</h2>
          <p class="text-sm text-neutral-500">
            Play individual seasons of {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 7)"
        />
      </div>
    </div>

    <!-- Remake -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 8),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Remake</h2>
          <p class="text-sm text-neutral-500">
            Play the remastered version of {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 8)"
        />
      </div>
    </div>

    <!-- Remaster -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 9),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Remaster</h2>
          <p class="text-sm text-neutral-500">
            Play the enhanced version of {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 9)"
        />
      </div>
    </div>

    <!-- Expanded Version -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 10),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Expanded Version</h2>
          <p class="text-sm text-neutral-500">
            Play the expanded version of {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 10)"
        />
      </div>
    </div>

    <!-- Port -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 411),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Port</h2>
          <p class="text-sm text-neutral-500">
            Play the ported version of {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 411)"
        />
      </div>
    </div>

    <!-- Fork -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 12),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Fork</h2>
          <p class="text-sm text-neutral-500">
            Play the forked version of {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 12)"
        />
      </div>
    </div>

    <!-- Game Packs -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 13),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Game Packs</h2>
          <p class="text-sm text-neutral-500">
            Play the game packs of {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 13)"
        />
      </div>
    </div>
    
    <!-- Updates -->
    <div
      v-if="
        game.collections?.length > 0 &&
        game.collections.some((collection) =>
          collection.games.some((game) => game.category === 14),
        )
      "
      class=""
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold">Updates</h2>
          <p class="text-sm text-neutral-500">
            See what's new in {{ game.name }}
          </p>
        </div>
        <GameGrid
          v-for="collection in game.collections"
          :games="collection.games.filter((game) => game.category === 14)"
        />
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
      class=""
    >
      <div class="flex flex-col gap-4" v-for="collection in game.collections">
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
