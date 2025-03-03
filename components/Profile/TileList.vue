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
const batchSize = 10; // Fetch detail game per 10 item

// Fetch semua data dari Supabase
const fetchAllGames = async () => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", user.value.id)
    .order("created_at", { ascending: false });

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
    allGames.value = await fetchAllGames();
    const firstBatch = allGames.value.slice(0, batchSize);
    paginatedGames.value = await fetchGameDetails(firstBatch);
    return paginatedGames.value;
  },
  {
    revalidateOnFocus: false,
  },
);

const fetchNextPage = async () => {
  if (isFinished.value) return;

  const nextPageOffset = paginatedGames.value.length;
  const nextBatch = allGames.value.slice(
    nextPageOffset,
    nextPageOffset + batchSize,
  );

  if (nextBatch.length === 0) {
    isFinished.value = true;
    return;
  }

  const games = await fetchGameDetails(nextBatch);
  data.value.push(...games);
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
