<script setup>
import pluralize from "pluralize";
import gameCategory from "@/json/game-category.json";
import Wishlist from "./Wishlist.vue";
import Favorite from "./Favorite.vue";

const { game, gameCover } = defineProps(["game", "gameCover"]);

const dayjs = useDayjs();

const category = gameCategory.find((item) => item.id === game.category).name;

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

// NOTE: If want to combine developer and publisher
const isSameDeveloperPublisher =
  developers?.length === publishers?.length &&
  developers?.every((d, i) => d.company.name === publishers[i].company.name);
</script>

<template>
  <div class="sticky top-[calc(72px+3px)] space-y-2">
    <!-- Poster -->
    <div
      class="flex flex-col gap-4 rounded-xl bg-neutral p-4 outline outline-secondary @md:mx-auto @md:grid @md:max-w-[640px] @md:grid-cols-2 @md:items-center"
    >
      <figure
        class="after-content relative after:pointer-events-none after:absolute after:left-2 after:top-2 after:rounded after:bg-black after:bg-opacity-60 after:p-1 after:px-2 after:text-sm after:text-white after:backdrop-blur"
        :data-after-content="category"
      >
        <img
          :src="`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover?.image_id}.jpg`"
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
            v-show="
              info.section === 'Release Date'
                ? info.text
                : info.text?.length > 0
            "
            :key="info.section"
            class="flex flex-col items-start text-sm"
          >
            <span v-if="info.text" class="font-medium text-neutral-500">
              {{
                info.section === "Developer" || info.section === "Publisher"
                  ? pluralize(info.section, info.text?.length)
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
                <NuxtLink
                  :to="`/search?company=${dev.company.slug}`"
                  class="hocus:text-primary"
                >
                  {{ dev.company.name }}
                </NuxtLink>

                <span class="last:hidden">, </span>
              </template>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- CTA -->
    <div class="flex gap-1">
      <!-- Wishlist -->
      <Wishlist :game="game" />

      <!-- Favorite -->
      <Favorite :game="game" />
    </div>
  </div>
</template>
