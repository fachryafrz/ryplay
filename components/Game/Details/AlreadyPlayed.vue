<script setup>
import useSWRV from "swrv";

const { game } = defineProps(["game"]);

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const mustLogin = useShowMustLogin();

const isAlreadyPlayed = ref(false);
const isUpcoming = ref(
  !game.first_release_date || game.first_release_date > Date.now() / 1000,
);

const checkAlreadyPlayed = async () => {
  if (!user.value) {
    isAlreadyPlayed.value = false;
    return;
  }

  const { data } = await supabase
    .from("already_played")
    .select("*")
    .eq("user_id", user.value.id)
    .eq("game_slug", game.slug);

  isAlreadyPlayed.value = data.length > 0;
};

// NOTE: Can't mutate/revalidate with SWRV, maybe a bug
const { data, mutate } = useSWRV(
  ["details", "alreadyPlayed"],
  () => checkAlreadyPlayed(),
  { revalidateOnFocus: false },
);

const addToAlreadyPlayed = async () => {
  if (!user.value) {
    mustLogin.value = "You must be logged in";
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
    mustLogin.value = "Error removing from alreadyPlayed";
    return;
  } else {
    checkAlreadyPlayed();
  }
};

watch(mustLogin, () => setTimeout(() => (mustLogin.value = null), 5e3), {
  immediate: true,
});
</script>

<template>
  <button
    @click.prevent="
      () => (isAlreadyPlayed ? removeFromAlreadyPlayed() : addToAlreadyPlayed())
    "
    :disabled="isUpcoming"
    :class="[
      'btn flex-1 flex-nowrap',
      { 'btn-secondary': !isAlreadyPlayed, 'btn-primary': isAlreadyPlayed },
    ]"
  >
    <Icon name="ion:game-controller" size="20" />
    <span class="whitespace-nowrap">Already Played</span>
  </button>
</template>
