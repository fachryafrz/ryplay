<script setup>
const { game } = defineProps(["game"]);

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isFavorite = ref(false);
const errorMessage = ref(null);

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
    errorMessage.value = "You must be logged in";
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

watch(errorMessage, () => setTimeout(() => (errorMessage.value = null), 5e3), {
  immediate: true,
});
</script>

<template>
  <button
    @click.prevent="() => (isFavorite ? removeFromFavorite() : addToFavorite())"
    :class="[
      'btn flex-1',
      { 'btn-ghost': !isFavorite, 'btn-primary': isFavorite },
    ]"
  >
    <Icon name="ion:star" size="20" />
    <span>Favorite</span>
  </button>

  <div v-if="errorMessage" class="toast">
    <div class="alert alert-error">
      <Icon name="ion:locked" size="20" />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>
