<script setup>
const config = useRuntimeConfig();

const upcomingGames = ref();
const popularGames = ref();
const featuredGames = ref();
const topRatedGames = ref();
const topDealsGames = ref();

const fetches = async () => {
  const { data: multiqueryResponse, error } =
    await useFetch("/api/multi-query");

  if (error.value) {
    throw error.value;
  }

  upcomingGames.value = multiqueryResponse.value.find(
    (res) => res.name === "upcoming",
  ).result;
  featuredGames.value = multiqueryResponse.value.find(
    (res) => res.name === "featured",
  ).result;
  topRatedGames.value = multiqueryResponse.value.find(
    (res) => res.name === "top-rated",
  ).result;
  topDealsGames.value = multiqueryResponse.value.find(
    (res) => res.name === "featured",
  ).result;

  const popularityData = multiqueryResponse.value.find(
    (res) => res.name === "popularity-data",
  ).result;

  const { data: popularGamesResponse, error: gamesError } = await useFetch(
    "/api/games/details",
    {
      params: {
        id: `(${popularityData.map((data) => data.game_id).join(",")})`,
        sort: `hypes desc`,
        limit: 20,
      },
    },
  );

  if (gamesError.value) {
    throw gamesError.value;
  }

  popularGames.value = popularGamesResponse.value;
};

try {
  await fetches();
} catch (error) {
  console.error("Failed to fetch games:", error);
}
</script>

<template>
  <h1 class="sr-only">{{ config.public.APP_NAME }}</h1>

  <div class="flex flex-col gap-4">
    <section>
      <GameHomeSlider :games="featuredGames" />
    </section>

    <section class="my-2">
      <div class="flex flex-col gap-2">
        <div>
          <h2 class="text-2xl font-bold">Upcoming Games</h2>
        </div>

        <div
          class="grid grid-cols-2 gap-2 md:grid-cols-4 xl:flex xl:overflow-x-auto"
        >
          <GameExpandableCard :games="upcomingGames" />
        </div>
      </div>
    </section>

    <section v-if="popularGames" class="my-2">
      <GameSlider
        id="popularGames"
        :games="popularGames"
        title="Popular Right Now"
        description="Popular Games of The Week"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topDealsGames"
        :games="topDealsGames"
        title="Top Deals For You"
        description="Get Best Discounts on Best Games"
        :slides-per-view="2"
        :slides-per-group="2"
        :breakpoints="{
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topDealsGames"
        :games="topDealsGames"
        title="Top Deals For You"
        description="Get Best Discounts on Best Games"
        :slides-per-view="2"
        :slides-per-group="2"
        :breakpoints="{
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
      />
    </section>

    <section class="my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Top Sellers"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Most Played"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Top Upcoming Wishlisted"
        />
      </div>
    </section>

    <section class="my-2">
      <GameSlider
        id="topDealsGames"
        :games="topDealsGames"
        title="Top Deals For You"
        description="Get Best Discounts on Best Games"
        :slides-per-view="2"
        :slides-per-group="2"
        :breakpoints="{
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
      />
    </section>

    <section class="my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Top Sellers"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Most Played"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Top Upcoming Wishlisted"
        />
      </div>
    </section>

    <section class="my-2">
      <GameSlider
        id="topDealsGames"
        :games="topDealsGames"
        title="Top Deals For You"
        description="Get Best Discounts on Best Games"
        :slides-per-view="2"
        :slides-per-group="2"
        :space-between="16"
        :breakpoints="{
          640: {
            slidesPerGroup: 2,
            slidesPerView: 2,
          },
        }"
        :isHorizontal="true"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
      />
    </section>

    <section class="my-8">
      <div class="flex flex-col gap-4 lg:flex-row [&_*]:flex-grow">
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Top Sellers"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Most Played"
        />
        <div class="divider flex-shrink lg:divider-horizontal"></div>
        <GameTile
          class="w-full"
          :games="topRatedGames.slice(0, 5)"
          title="Top Upcoming Wishlisted"
        />
      </div>
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topRatedGames"
        :games="topRatedGames"
        title="Top Rated"
        description="Most Popular Games of All Time"
      />
    </section>

    <section class="my-2">
      <GameSlider
        id="topDealsGames"
        :games="topDealsGames"
        title="Top Deals For You"
        description="Get Best Discounts on Best Games"
        :slides-per-view="2"
        :slides-per-group="2"
        :breakpoints="{
          1024: {
            slidesPerGroup: 3,
            slidesPerView: 3,
          },
        }"
        :isHorizontal="true"
      />
    </section>
  </div>
</template>
