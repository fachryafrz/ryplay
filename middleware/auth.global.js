export default defineNuxtRouteMiddleware((to, _from) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  if (to.query.code) {
    const exchangeCodeForSession = async () => {
      await supabase.auth.exchangeCodeForSession(to.query.code);

      return navigateTo(to.path);
    };

    exchangeCodeForSession();
  }

  if (!user.value && to.path === "/profile") {
    return navigateTo("/login");
  }

  if ((to.path === "/login" || to.path === "/sign-up") && user.value) {
    return navigateTo("/profile");
  }
});
