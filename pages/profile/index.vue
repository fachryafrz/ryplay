<script setup>
import axios from "axios";

const supabase = useSupabaseClient();
const route = useRoute();
const user = useSupabaseUser();

const favorites = ref([]);
const wishlist = ref([]);
const loadingFavorites = ref(false);
const loadingWishlist = ref(false);

const getFavorites = async () => {
  loadingFavorites.value = true;

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.value.id);

  if (error) {
    console.error(error);
    loadingFavorites.value = false;
    return;
  } else {
    const games = await Promise.all(
      data.map(async (game) => {
        const { data: gameData } = await axios.get("/api/games/details", {
          params: {
            slug: game.game_slug,
          },
        });

        return gameData[0];
      }),
    );

    loadingFavorites.value = false;
    favorites.value = games;
  }
};

const getWishlist = async () => {
  loadingWishlist.value = true;

  const { data, error } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.value.id);

  if (error) {
    console.error(error);
    loadingWishlist.value = false;
    return;
  } else {
    const games = await Promise.all(
      data.map(async (game) => {
        const { data: gameData } = await axios.get("/api/games/details", {
          params: {
            slug: game.game_slug,
          },
        });

        return gameData[0];
      }),
    );

    loadingWishlist.value = false;
    wishlist.value = games;
  }
};

const signOut = async () => {
  await supabase.auth.signOut();

  if (route.path === "/profile") {
    return navigateTo("/login");
  }
};

onMounted(() => {
  getFavorites();
  getWishlist();
});
</script>

<template>
  <div class="relative">
    <!-- Profile -->
    <section>
      <div
        class="flex flex-col items-center justify-center gap-2 p-4 text-center"
      >
        <!-- Info -->
        <h1 class="text-4xl font-bold">{{ user.user_metadata.username }}</h1>
        <h2>{{ user.email }}</h2>
      </div>

      <div class="mx-auto w-fit sm:absolute sm:right-4 sm:top-4">
        <button @click="signOut" class="btn btn-error btn-sm">Logout</button>
      </div>
    </section>

    <!-- Games -->
    <section class="grid grid-cols-2 gap-4">
      <div class="p-2 bg-neutral rounded-2xl">
        <h2 class="heading-2 text-center">Favorites</h2>

        <ul v-if="loadingFavorites">
          <li v-for="i in 3" :key="i">
            <SkeletonTileCard />
          </li>
        </ul>

        <ul v-if="favorites.length > 0">
          <li v-for="game in favorites" :key="game.slug">
            <GameTileCard :game="game" />
          </li>
        </ul>

        <div v-else class="flex items-center justify-center">
          <p class="text-center">No favorites yet.</p>
        </div>
      </div>

      <div class="p-2 bg-neutral rounded-2xl">
        <h2 class="heading-2 text-center">Wishlist</h2>

        <ul v-if="loadingWishlist">
          <li v-for="i in 3" :key="i">
            <SkeletonTileCard />
          </li>
        </ul>

        <ul v-if="wishlist.length > 0">
          <li v-for="game in wishlist" :key="game.slug">
            <GameTileCard :game="game" />
          </li>
        </ul>

        <div v-else class="flex items-center justify-center">
          <p class="text-center">No wishlist yet.</p>
        </div>
      </div>
    </section>
  </div>
</template>
