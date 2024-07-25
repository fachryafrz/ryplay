<script setup>
import GamePoster from "~/components/Game/Details/GameInfo/GamePoster.vue";
import GameInfo from "~/components/Game/Details/GameInfo/index.vue";
import GameMedia from "~/components/Game/Details/GameMedia.vue";

const { slug } = useRoute().params;

const game = ref([]);

const dayjs = useDayjs();
const gameCover = ref("");
const developers = ref([]);
const publishers = ref([]);
const gameInfo = ref([]);

const fetchGameDetails = async () => {
  const response = await $fetch("/api/games/details", {
    params: {
      slug: slug,
    },
  });

  const data = response[0];
  game.value = data;
};

try {
  await fetchGameDetails();
} catch (error) {
  if (error.statusCode === 401) {
    try {
      await $fetch("/api/token");
      await fetchGameDetails();
    } catch (tokenError) {
      console.error("Error saat mendapatkan token:", tokenError);
    }
  }
}

onMounted(() => {
  gameCover.value = `https://images.igdb.com/igdb/image/upload/t_720p/${game.value.cover?.image_id}.jpg`;

  const uniqueCompanies = game.value.involved_companies?.filter(
    (company, index, self) =>
      index === self.findIndex((t) => t.company.id === company.company.id),
  );

  developers.value = uniqueCompanies?.filter((company) => company.developer);
  publishers.value = uniqueCompanies?.filter((company) => company.publisher);
  gameInfo.value = [
    {
      section: "Release Date",
      icon: "calendar_month",
      text: dayjs.unix(game.value.first_release_date).format("MMMM D, YYYY"),
    },
    {
      section: "Developed by",
      icon: "code",
      text: developers.value?.map((dev) => dev.company.name).join(", "),
    },
    {
      section: "Published by",
      icon: "domain",
      text: publishers.value?.map((dev) => dev.company.name).join(", "),
    },
  ];
});
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div
      class="order-2 col-span-full mt-4 lg:order-1 lg:col-[1/9] lg:mt-0 xl:col-[1/10]"
    >
      <GameMedia :game="game" />
    </div>

    <div class="order-3 col-span-full lg:col-[1/9] lg:row-[2/3] xl:col-[1/10]">
      <GameInfo
        :game="game"
        :publishers="publishers"
        :developers="developers"
      />
    </div>

    <div
      class="order-1 col-span-full flex justify-center lg:col-[9/13] lg:row-[1/3] xl:col-[10/13]"
    >
      <GamePoster
        :game="game"
        :game-cover="gameCover"
        :game-info="gameInfo"
        :publishers="publishers"
      />
    </div>

    <div v-if="game.collection" class="order-4 col-span-full">
      <div class="flex flex-col gap-4">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-bold">
              {{ game.collection?.name }} Collection
            </h2>
            <p class="text-sm text-neutral-500">
              Discover games in the {{ game.collection?.name }} collection
            </p>
          </div>

          <NuxtLink
            to="/"
            class="flex items-center gap-2 !bg-transparent text-sm font-medium text-primary [&_*]:transition-all first:[&_span]:hocus:-translate-x-1 last:[&_span]:hocus:scale-125"
          >
            <span>See all</span>

            <span class="material-symbols-outlined text-sm">
              arrow_forward_ios
            </span>
          </NuxtLink>
        </div>

        <GameSlider
          id="collection"
          :breakpoints="{
            640: {
              slidesPerGroup: 2,
            },
            768: {
              slidesPerGroup: 3,
            },
            1024: {
              slidesPerGroup: 4,
            },
            1280: {
              slidesPerGroup: 5,
            },
          }"
        >
          <SwiperSlide
            v-for="game in game.collection?.games"
            :key="game.slug"
            class="max-w-[calc(100%/1.8)] sm:max-w-[calc(100%/2.8)] md:max-w-[calc(100%/3.8)] lg:max-w-[calc(100%/4.8)] xl:max-w-[calc(100%/5.8)]"
          >
            <GameCard :game="game" :isHorizontal="false" />
          </SwiperSlide>
        </GameSlider>
      </div>
    </div>

    <div v-if="game.similar_games?.length > 0" class="order-4 col-span-full">
      <div class="flex flex-col gap-4">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-bold">Similar Games</h2>
            <p class="text-sm text-neutral-500">
              Discover games similar to this one
            </p>
          </div>

          <NuxtLink
            to="/"
            class="flex items-center gap-2 !bg-transparent text-sm font-medium text-primary [&_*]:transition-all first:[&_span]:hocus:-translate-x-1 last:[&_span]:hocus:scale-125"
          >
            <span>See all</span>

            <span class="material-symbols-outlined text-sm">
              arrow_forward_ios
            </span>
          </NuxtLink>
        </div>

        <GameSlider
          id="similarGames"
          :breakpoints="{
            640: {
              slidesPerGroup: 2,
            },
            768: {
              slidesPerGroup: 3,
            },
            1024: {
              slidesPerGroup: 4,
            },
            1280: {
              slidesPerGroup: 5,
            },
          }"
        >
          <SwiperSlide
            v-for="game in game.similar_games"
            :key="game.slug"
            class="max-w-[calc(100%/1.8)] sm:max-w-[calc(100%/2.8)] md:max-w-[calc(100%/3.8)] lg:max-w-[calc(100%/4.8)] xl:max-w-[calc(100%/5.8)]"
          >
            <GameCard :game="game" :isHorizontal="false" />
          </SwiperSlide>
        </GameSlider>
      </div>
    </div>
  </div>
</template>
