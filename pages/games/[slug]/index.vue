<script setup>
import GamePoster from "~/components/Game/Details/GameInfo/GamePoster.vue";
import GameInfo from "~/components/Game/Details/GameInfo/index.vue";
import GameMedia from "~/components/Game/Details/GameMedia.vue";
import SimilarGames from "~/components/Game/Details/SimilarGames.vue";

const { slug } = useRoute().params;

const game = ref([]);

const dayjs = useDayjs();
const gameCover = ref("");
const developers = ref([]);
const publishers = ref([]);
const gameInfo = ref([]);

try {
  const response = await $fetch("/api/games/details", {
    params: {
      slug: slug,
    },
  });

  const data = response[0];
  game.value = data;
} catch (error) {
  console.error("Failed to fetch games:", error);
}

onMounted(() => {
  gameCover.value = `https://images.igdb.com/igdb/image/upload/t_720p/${game.value.cover.image_id}.jpg`;

  const uniqueCompanies = game.value.involved_companies.filter(
    (company, index, self) =>
      index === self.findIndex((t) => t.company.id === company.company.id),
  );

  developers.value = uniqueCompanies.filter((company) => company.developer);
  publishers.value = uniqueCompanies.filter((company) => company.publisher);
  gameInfo.value = [
    {
      section: "Release Date",
      text: dayjs.unix(game.value.first_release_date).format("MMMM D, YYYY"),
    },
    {
      section: "Developed by",
      text: developers.value.map((dev) => dev.company.name).join(", "),
    },
    {
      section: "Published by",
      text: publishers.value.map((dev) => dev.company.name).join(", "),
    },
  ];
});
</script>

<template>
  <Header :disable-search-bar="true" />

  <div class="grid grid-cols-12 gap-8 lg:gap-4">
    <div class="order-2 col-span-full lg:order-1">
      <GameMedia :game="game" />
    </div>

    <div
      class="order-3 col-span-full mt-[4rem] sm:mt-[2rem] lg:order-2 lg:col-span-7 xl:mt-[6rem] lg:mt-[4rem] xl:col-span-8"
    >
      <GameInfo
        :game="game"
        :publishers="publishers"
        :developers="developers"
      />
    </div>

    <div
      class="order-1 col-span-full flex justify-center lg:order-3 lg:col-span-5 xl:mt-[6rem] lg:mt-[4rem] lg:justify-end xl:col-span-4"
    >
      <GamePoster
        :game="game"
        :game-cover="gameCover"
        :game-info="gameInfo"
        :publishers="publishers"
      />
    </div>

    <div class="order-4 col-span-full">
      <SimilarGames :game="game" />
    </div>
  </div>
</template>
