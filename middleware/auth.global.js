export default defineNuxtRouteMiddleware(async (to, _from) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  if (to.query.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(to.query.code);
    if (error) {
      console.error("Error exchanging code for session:", error);
    } else {
      return navigateTo(to.path);
    }
  }

  if (!user.value && to.path === "/profile") {
    return navigateTo("/login");
  }

  if ((to.path === "/login" || to.path === "/sign-up") && user.value) {
    return navigateTo("/profile");
  }
});
