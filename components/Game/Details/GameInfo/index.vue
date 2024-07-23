<script setup>
import AdditionalInfo from "./AdditionalInfo.vue";

const { game, publishers, developers } = defineProps([
  "game",
  "publishers",
  "developers",
]);
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="hidden text-center lg:block lg:text-start">
      <h1 class="mb-2 text-pretty text-3xl font-bold md:text-4xl xl:text-5xl">
        {{ game.name }}
      </h1>
      <span>
        {{
          publishers.map((dev) => dev.company.name).join(", ") ||
          developers.map((dev) => dev.company.name).join(", ")
        }}
      </span>
    </section>

    <section class="prose max-w-none font-semibold text-neutral-500">
      <MDC :value="game.storyline" class="[&_p]:mt-0" v-if="game.storyline" />

      <MDC :value="game.summary" class="[&_p]:mt-0" v-if="game.summary" />
    </section>

    <section>
      <AdditionalInfo :game="game" />
    </section>
  </div>
</template>
