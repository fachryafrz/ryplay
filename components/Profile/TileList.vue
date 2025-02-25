<script setup>
import axios from "axios";
import useSWRV from "swrv";

const { title, emptyMessage, table } = defineProps([
  "title",
  "emptyMessage",
  "table",
]);

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const fetchGameDetails = async (games) => {
  const { data } = await axios.get("/api/games/details", {
    params: {
      slug: games.map((game) => `"${game.game_slug}"`).join(","),
      limit: games.length,
    },
  });

  return data;
};

const { data, isLoading } = useSWRV(
  ["profile", title, user.value.id],
  async () => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", user.value.id);

    if (error) {
      console.error(error);
      return;
    } else {
      const games = await fetchGameDetails(data);

      return games;
    }
  },
  {},
);
</script>

<template>
  <div class="space-y-2 rounded-2xl bg-neutral p-2">
    <h2 class="heading-2 text-center">{{ title }}</h2>

    <ul v-if="isLoading">
      <li v-for="i in 3" :key="i">
        <SkeletonTileCard />
      </li>
    </ul>

    <ul v-if="data?.length > 0" class="max-h-[500px] overflow-y-auto">
      <li v-for="game in data" :key="game.slug">
        <GameTileCard :game="game" />
      </li>
    </ul>

    <div
      v-if="!isLoading && data?.length === 0"
      class="flex h-full items-center justify-center"
    >
      <p class="text-center">{{ emptyMessage }}</p>
    </div>
  </div>
</template>
