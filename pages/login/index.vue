<script setup>
const identifier = ref("");
const password = ref("");
const supabase = useSupabaseClient();

const signIn = async () => {
  let email = identifier.value;

  // Jika input bukan email, asumsikan itu adalah username
  if (!identifier.value.includes("@")) {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", identifier.value)
      .single();

    if (error) {
      console.error("Username not found:", error.message);
      return;
    }

    email = data.email;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: password.value,
  });

  if (error) {
    console.error("Error signing in:", error.message);
  } else {
    console.log("Sign-in successful");
  }
};
</script>

<template>
  <form @submit.prevent="signIn">
    <input
      v-model="identifier"
      type="text"
      placeholder="Email or Username"
      required
    />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Sign In</button>
  </form>
</template>
