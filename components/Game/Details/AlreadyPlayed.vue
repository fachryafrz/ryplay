<script setup>
const { game } = defineProps(["game"]);

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isAlreadyPlayed = ref(false);
const errorMessage = ref(null);
const isUpcoming = ref(game.first_release_date > Date.now() / 1000);

const checkAlreadyPlayed = async () => {
  const { data } = await supabase
    .from("already_played")
    .select("*")
    .eq("user_id", user.value.id)
    .eq("game_slug", game.slug);

  if (data.length > 0) {
    isAlreadyPlayed.value = true;
  } else {
    isAlreadyPlayed.value = false;
  }
};

const addToAlreadyPlayed = async () => {
  if (!user.value) {
    errorMessage.value = "You must be logged in";
    return;
  }

  const { data, error } = await supabase
    .from("already_played")
    .insert({ game_slug: game.slug, user_id: user.value.id })
    .select("*");

  if (error) {
    console.error(error);
    return;
  } else {
    console.log(data);
    checkAlreadyPlayed();
  }
};

const removeFromAlreadyPlayed = async () => {
  const { data, error } = await supabase
    .from("already_played")
    .delete()
    .eq("game_slug", game.slug)
    .eq("user_id", user.value.id)
    .select("*");

  if (error) {
    console.error(error);
    errorMessage.value = "Error removing from alreadyPlayed";
    return;
  } else {
    console.log(data);
    checkAlreadyPlayed();
  }
};

onMounted(() => {
  if (user.value) {
    checkAlreadyPlayed();
  }
});

watch(errorMessage, () => setTimeout(() => (errorMessage.value = null), 5e3), {
  immediate: true,
});
</script>

<template>
  <button
    @click.prevent="() => (isAlreadyPlayed ? removeFromAlreadyPlayed() : addToAlreadyPlayed())"
    :disabled="isUpcoming"
    :class="[
      'btn flex-1',
      { 'btn-ghost': !isAlreadyPlayed, 'btn-primary': isAlreadyPlayed },
    ]"
  >
    <Icon name="ion:game-controller" size="20" />
    <span>Already Played</span>
  </button>

  <div v-if="errorMessage" class="toast">
    <div class="alert alert-error">
      <Icon name="ion:locked" size="20" />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>
