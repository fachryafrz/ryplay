<script setup>
const { game, gameCover, gameInfo, publishers } = defineProps([
  "game",
  "gameCover",
  "gameInfo",
  "publishers",
]);
</script>

<template>
  <div class="max-w-fit">
    <!-- Container -->
    <div
      class="top-4 flex flex-col gap-4 rounded-3xl bg-secondary p-4 lg:sticky"
    >
      <figure class="aspect-poster max-w-[300px]">
        <img :src="gameCover" :alt="game.name" />
      </figure>

      <div>
        <table
          class="w-full max-w-[300px] text-sm lg:text-xs xl:text-sm [&_td]:py-1 [&_td]:align-top"
        >
          <tr v-for="info in gameInfo">
            <td class="font-semibold text-neutral-500 xl:min-w-[150px]">
              {{ info.section }}
            </td>
            <td class="text-end">{{ info.text }}</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="mt-4 text-center lg:hidden xl:text-start">
      <h1 class="mb-2 text-pretty text-3xl font-bold md:text-4xl xl:text-5xl">
        {{ game.name }}
      </h1>
      <span>
        {{ publishers.map((dev) => dev.company.name).join(", ") }}
      </span>
    </div>
  </div>
</template>
