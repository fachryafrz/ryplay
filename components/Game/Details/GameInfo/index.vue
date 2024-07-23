<script setup>
import AdditionalInfo from "./AdditionalInfo.vue";

const { game } = defineProps(["game"]);

const dayjs = useDayjs();
const gameCover = ref("");
const developers = ref([]);
const publishers = ref([]);
const gameInfo = ref([]);

onMounted(() => {
  gameCover.value = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg`;

  const uniqueCompanies = game.involved_companies.filter(
    (company, index, self) =>
      index === self.findIndex((t) => t.company.id === company.company.id),
  );

  developers.value = uniqueCompanies.filter((company) => company.developer);
  publishers.value = uniqueCompanies.filter((company) => company.publisher);
  gameInfo.value = [
    {
      section: "Release Date",
      text: dayjs.unix(game.first_release_date).format("MMMM D, YYYY"),
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
  <div class="grid gap-4 xl:grid-cols-3 mt-28">
    <!-- Left -->
    <div class="order-2 flex xl:max-w-3xl flex-col gap-4 xl:order-1 xl:col-span-2">
      <section class="text-center xl:text-start">
        <h1 class="mb-2 text-5xl font-bold">{{ game.name }}</h1>
        <span>
          {{ publishers.map((dev) => dev.company.name).join(", ") }}
        </span>
      </section>

      <section class="prose max-w-none font-semibold text-neutral-500">
        <h2 class="mb-0 mt-4">Storyline</h2>
        <MDC :value="game.storyline" class="[&_p]:mt-0" />

        <h2 class="mb-0 mt-4">Summary</h2>
        <MDC :value="game.summary" class="[&_p]:mt-0" />
      </section>

      <section>
        <AdditionalInfo :game="game" />
      </section>
    </div>

    <!-- Right -->
    <div
      class="order-1 max-w-fit justify-self-center xl:order-2 xl:justify-self-end"
    >
      <!-- Container -->
      <div
        class="sticky top-4 flex flex-col gap-4 rounded-3xl bg-secondary p-4"
      >
        <figure class="aspect-poster max-w-[300px]">
          <img :src="gameCover" :alt="game.name" />
        </figure>

        <div>
          <table
            class="w-full max-w-[300px] text-sm [&_td]:py-1 [&_td]:align-top"
          >
            <tr v-for="info in gameInfo">
              <td class="min-w-[150px] font-semibold text-neutral-500">
                {{ info.section }}
              </td>
              <td class="text-end">{{ info.text }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
