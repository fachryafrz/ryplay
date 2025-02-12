<script setup>
const supabase = useSupabaseClient();
const route = useRoute();
const user = useSupabaseUser();

const signOut = async () => {
  await supabase.auth.signOut();

  if (route.path === "/profile") {
    return navigateTo("/login");
  }
};
</script>

<template>
  <div class="relative">
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
  </div>
</template>
