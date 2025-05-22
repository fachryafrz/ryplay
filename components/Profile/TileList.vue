<script setup>
import axios from "axios";
import useSWRV from "swrv";

const { title, emptyMessage, table } = defineProps([
  "title",
  "emptyMessage",
  "table",
]);

// Supabase
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// State Management
const isFinished = ref(false);
const loadMoreRef = ref(null);
const allGames = ref([]); // Menyimpan semua game dari Supabase
const paginatedGames = ref([]); // Game yang akan ditampilkan
const batchSize = 20; // Fetch detail game per 10 item
const offset = ref(0);

const fetchGamesPage = async (from, to) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", user.value.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

// Fetch detail game ke IGDB dan mempertahankan urutan berdasarkan created_at
const fetchGameDetails = async (games) => {
  if (games.length === 0) return [];

  // Simpan order berdasarkan created_at dari Supabase
  const orderedGames = games.map((game) => ({
    game_slug: game.game_slug,
    created_at: game.created_at,
  }));

  const { data } = await axios.get("/api/games/details", {
    params: {
      slug: orderedGames.map((game) => `"${game.game_slug}"`).join(","),
      limit: orderedGames.length,
    },
  });

  // Gabungkan hasil dari IGDB dengan `created_at` dari Supabase
  const enrichedGames = orderedGames.map((game) => ({
    ...data.find((g) => g.slug === game.game_slug), // Ambil data dari IGDB
    created_at: game.created_at, // Pertahankan urutan berdasarkan Supabase
  }));

  // Urutkan kembali berdasarkan `created_at`
  return enrichedGames.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
};
const { data, isLoading } = useSWRV(
  ["profile", title, user.value.id],
  async () => {
    const games = await fetchGamesPage(0, batchSize - 1);
    offset.value = batchSize;
    const detailed = await fetchGameDetails(games);
    paginatedGames.value = detailed;
    return detailed;
  },
  {
    revalidateOnFocus: false,
  },
);

const fetchNextPage = async () => {
  if (isFinished.value) return;

  const games = await fetchGamesPage(
    offset.value,
    offset.value + batchSize - 1,
  );

  if (games.length === 0) {
    isFinished.value = true;
    return;
  }

  offset.value += games.length;

  const detailed = await fetchGameDetails(games);

  // Cek apakah slug-nya sudah ada di data
  const existingSlugs = new Set(data.value.map((g) => g.slug));
  const newGames = detailed.filter((g) => !existingSlugs.has(g.slug));

  data.value.push(...newGames);
};

useInfiniteScroll(
  loadMoreRef,
  async () => {
    await fetchNextPage();
  },
  { distance: 10 },
);
</script>

<template>
  <div class="space-y-2 rounded-2xl bg-neutral p-2">
    <h2 class="heading-2 text-center">{{ title }}</h2>

    <ul v-if="isLoading">
      <li v-for="i in 4" :key="i">
        <SkeletonTileCard :num="true" />
      </li>
    </ul>

    <ul v-if="data?.length > 0" class="max-h-[500px] overflow-y-auto">
      <li v-for="(game, index) in data" :key="game.slug">
        <GameTileCard :game="game" :num="index + 1" />
      </li>

      <template v-if="!isLoading && !isFinished">
        <li>
          <SkeletonTileCard :num="true" ref="loadMoreRef" />
        </li>
        <li v-for="i in 2" :key="i">
          <SkeletonTileCard :num="true" />
        </li>
      </template>
    </ul>

    <div
      v-if="!isLoading && data?.length === 0"
      class="flex h-full min-h-[100px] items-center justify-center"
    >
      <p class="text-center">{{ emptyMessage }}</p>
    </div>
  </div>
</template>
