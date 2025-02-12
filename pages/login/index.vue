<script setup>
const identifier = ref("");
const password = ref("");
const loginError = ref("");
const supabase = useSupabaseClient();
const loading = ref(false);

const signIn = async () => {
  loading.value = true;

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
      loginError.value = "Username not found";
      return;
    }

    email = data.email;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: password.value,
  });

  loading.value = false;

  if (error) {
    console.error("Error signing in:", error.message);
    loginError.value = error.message;
    return;
  } else {
    console.log("Sign-in successful");
    loginError.value = "";
    navigateTo("/");
  }
};
</script>

<template>
  <div
    class="flex h-[calc(100dvh-72px)] flex-col items-center justify-center gap-4 pb-20"
  >
    <div class="flex flex-col items-center gap-2">
      <Logo width="60" height="60" />

      <h1 class="text-2xl font-bold">Welcome back!</h1>
    </div>

    <div v-if="loginError" role="alert" class="alert alert-error max-w-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ loginError }}</span>
    </div>

    <form @submit.prevent="signIn" class="flex w-full max-w-sm flex-col gap-2">
      <!-- Username or Email -->
      <label class="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
          />
        </svg>
        <input
          v-model="identifier"
          type="text"
          class="grow"
          placeholder="Username or Email"
          required
        />
      </label>

      <label class="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          v-model="password"
          type="password"
          class="grow"
          placeholder="Password"
          required
        />
      </label>
      <button type="submit" :disabled="loading" class="btn btn-primary">
        <span v-if="loading" class="loading loading-spinner"></span>
        <span v-else>Sign In</span>
      </button>
    </form>
  </div>
</template>
