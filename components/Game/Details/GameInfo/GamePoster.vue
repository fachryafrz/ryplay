<script setup>
import { isPlural } from "~/helper/isPlural";

const { game, gameCover } = defineProps(["game", "gameCover"]);

const dayjs = useDayjs();

const uniqueCompanies = game.involved_companies?.filter(
  (company, index, self) =>
    index === self.findIndex((t) => t.company.id === company.company.id),
);

const developers = uniqueCompanies?.filter((company) => company.developer);
const publishers = uniqueCompanies?.filter((company) => company.publisher);
const gameInfo = [
  {
    section: "Release Date",
    icon: "calendar_month",
    text: game.first_release_date
      ? dayjs.unix(game.first_release_date).format("MMMM D, YYYY")
      : "TBA",
  },
  {
    section: "Developer",
    icon: "code",
    text: developers.map((dev) => dev.company.name).join(", "),
  },
  {
    section: "Publisher",
    icon: "domain",
    text: publishers.map((dev) => dev.company.name).join(", "),
  },
];
</script>

<template>
  <div
    class="sticky top-[calc(5rem+0.75rem)] flex flex-col gap-4 rounded-xl bg-neutral p-4 outline outline-secondary @md:mx-auto @md:grid @md:max-w-xl @md:grid-cols-2 @md:items-center"
  >
    <figure class="">
      <img :src="gameCover" :alt="game.name" class="rounded-md" />
    </figure>

    <div class="flex flex-col gap-4">
      <h1 class="text-pretty text-center text-2xl font-bold @md:text-start">
        {{ game.name }}
      </h1>

      <!-- Release date, devs, publishers -->
      <ul class="flex flex-wrap gap-4">
        <li v-for="info in gameInfo" class="flex flex-col items-start text-sm">
          <span v-if="info.text" class="font-medium text-neutral-500">
            {{
              Array.isArray(info.text)
                ? isPlural(info.text.length, info.section, `${info.section}s`)
                : info.section
            }}
          </span>
          <span v-if="info.text" class="font-semibold">
            {{
              Array.isArray(info.text)
                ? info.text
                : info.text
            }}
          </span>
        </li>
      </ul>

      <!-- NOTE: API Call took so long -->
      <!-- <ul class="flex flex-wrap gap-4">
        <li
          v-for="(info, index) in gameInfo"
          :key="index"
          class="flex flex-col items-start text-sm"
        >
          <span v-if="info.text || (info.items && info.items.length)" class="font-medium text-neutral-500">
            {{ info.section }}
          </span>

          <span v-if="info.section === 'Release Date'" class="font-semibold">
            {{ info.text }}
          </span>

          <span v-else-if="info.items && info.items.length" class="font-semibold">
            <template v-for="(item, i) in info.items">
              <NuxtLink
                :to="`/search?company=${item.company.slug}`"
              >
                {{ item.company.name }}
              </NuxtLink>
              <span v-if="i < info.items.length - 1">, </span>
            </template>
          </span>
        </li>
      </ul> -->
    </div>
  </div>
</template>
