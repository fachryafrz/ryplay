<script setup>
const email = ref("");
const username = ref("");
const password = ref("");
const supabase = useSupabaseClient();

const signUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        username: username.value,
      },
    },
  });

  if (error) {
    console.error("Error signing up:", error.message);
  } else {
    console.log("Sign-up successful:", data);
  }
};
</script>

<template>
  <form @submit.prevent="signUp">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="username" type="text" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Sign Up</button>
  </form>
</template>
