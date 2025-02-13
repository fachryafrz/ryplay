<script setup>
const { game } = defineProps(["game"]);

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const mustLogin = useShowMustLogin();

const isFavorite = ref(false);
const isUpcoming = ref(game.first_release_date > Date.now() / 1000);

const checkFavorite = async () => {
  const { data } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.value.id)
    .eq("game_slug", game.slug);

  if (data.length > 0) {
    isFavorite.value = true;
  } else {
    isFavorite.value = false;
  }
};

const addToFavorite = async () => {
  if (!user.value) {
    mustLogin.value = "You must be logged in";
    return;
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert({ game_slug: game.slug, user_id: user.value.id })
    .select("*");

  if (error) {
    console.error(error);
    return;
  } else {
    console.log(data);
    checkFavorite();
  }
};

const removeFromFavorite = async () => {
  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("game_slug", game.slug)
    .eq("user_id", user.value.id)
    .select("*");

  if (error) {
    console.error(error);
    return;
  } else {
    console.log(data);
    checkFavorite();
  }
};

onMounted(() => {
  if (user.value) {
    checkFavorite();
  }
});

watch(mustLogin, () => setTimeout(() => (mustLogin.value = null), 5e3), {
  immediate: true,
});
</script>

<template>
  <button
    @click.prevent="() => (isFavorite ? removeFromFavorite() : addToFavorite())"
    :disabled="isUpcoming"
    :class="[
      'btn flex-1 flex-nowrap',
      { 'btn-ghost': !isFavorite, 'btn-primary': isFavorite },
    ]"
  >
    <Icon name="ion:star" size="20" />
    <span>Favorite</span>
  </button>
</template>
