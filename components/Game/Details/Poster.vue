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
    text: developers,
  },
  {
    section: "Publisher",
    icon: "domain",
    text: publishers,
  },
];

console.log(developers);
</script>

<template>
  <div
    class="top sticky top-[calc(72px+3px)] flex flex-col gap-4 rounded-xl bg-neutral p-4 outline outline-secondary @md:mx-auto @md:grid @md:max-w-[640px] @md:grid-cols-2 @md:items-center"
  >
    <figure class="">
      <img
        :src="gameCover"
        :alt="game.name"
        class="rounded-md"
        draggable="false"
        loading="lazy"
      />
    </figure>

    <div class="flex flex-col gap-4">
      <!-- Release date, devs, publishers -->
      <ul class="flex flex-wrap gap-4">
        <li
          v-for="info in gameInfo"
          :key="info.section"
          class="flex flex-col items-start text-sm"
        >
          <span v-if="info.text" class="font-medium text-neutral-500">
            {{
              info.section === "Developer" || info.section === "Publisher"
                ? isPlural(info.text.length, info.section, `${info.section}s`)
                : info.section
            }}
          </span>

          <span v-if="info.text" class="font-semibold">
            <template v-if="info.section === 'Release Date'">
              <time :datetime="$dayjs.unix(game.first_release_date).format()">
                {{ info.text }}
              </time>
            </template>

            <template v-else v-for="dev in info.text">
              <NuxtLink :to="`/search?company=${dev.company.slug}`">
                {{ dev.company.name }}
              </NuxtLink>

              <span class="last:hidden">, </span>
            </template>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
