<script setup>
import useSWRV from "swrv";

const { game } = defineProps(["game"]);

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const mustLogin = useShowMustLogin();

const isWishlist = ref(false);

const checkWishlist = async () => {
  if (!user.value) {
    isWishlist.value = false;
    return;
  }

  const { data } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.value.id)
    .eq("game_slug", game.slug);

  isWishlist.value = data.length > 0;
};

// NOTE: Can't mutate/revalidate with SWRV, maybe a bug
const { data, mutate } = useSWRV(
  ["details", "wishlist"],
  () => checkWishlist(),
  { revalidateOnFocus: false },
);

const addToWishlist = async () => {
  if (!user.value) {
    mustLogin.value = "You must be logged in";
    return;
  }

  const { data, error } = await supabase
    .from("wishlist")
    .insert({ game_slug: game.slug, user_id: user.value.id })
    .select("*");

  if (error) {
    console.error(error);
    return;
  } else {
    checkWishlist();
  }
};

const removeFromWishlist = async () => {
  const { data, error } = await supabase
    .from("wishlist")
    .delete()
    .eq("game_slug", game.slug)
    .eq("user_id", user.value.id)
    .select("*");

  if (error) {
    console.error(error);
    mustLogin.value = "Error removing from wishlist";
    return;
  } else {
    checkWishlist();
  }
};

watch(mustLogin, () => setTimeout(() => (mustLogin.value = null), 5e3), {
  immediate: true,
});
</script>

<template>
  <button
    @click.prevent="() => (isWishlist ? removeFromWishlist() : addToWishlist())"
    :class="[
      'btn flex-1 flex-nowrap',
      { 'btn-secondary': !isWishlist, 'btn-primary': isWishlist },
    ]"
  >
    <Icon name="ion:bookmark" size="20" />
    <span>Wishlist</span>
  </button>
</template>
