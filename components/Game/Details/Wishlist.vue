<script setup>
const { game } = defineProps(["game"]);

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const mustLogin = useShowMustLogin();

const isWishlist = ref(false);

const checkWishlist = async () => {
  const { data } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.value.id)
    .eq("game_slug", game.slug);

  if (data.length > 0) {
    isWishlist.value = true;
  } else {
    isWishlist.value = false;
  }
};

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
    console.log(data);
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
    console.log(data);
    checkWishlist();
  }
};

onMounted(() => {
  if (user.value) {
    checkWishlist();
  }
});

watch(mustLogin, () => setTimeout(() => (mustLogin.value = null), 5e3), {
  immediate: true,
});
</script>

<template>
  <button
    @click.prevent="() => (isWishlist ? removeFromWishlist() : addToWishlist())"
    :class="[
      'btn flex-1 flex-nowrap',
      { 'btn-ghost': !isWishlist, 'btn-primary': isWishlist },
    ]"
  >
    <Icon name="ion:bookmark" size="20" />
    <span>Wishlist</span>
  </button>
</template>
