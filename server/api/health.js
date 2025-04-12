import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { secret } = getQuery(event);
  const expected = config.HEALTH_SECRET;

  if (secret !== expected) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" }),
    );
  }

  const supabase = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_KEY,
  );

  const { data, error } = await supabase.from("profiles").select("id").limit(1);

  if (error) {
    // log gagal
    await supabase.from("health_logs").insert({
      called_at: new Date().toISOString(),
      status: "failed",
      message: error.message,
    });
    return { success: false, error: error.message };
  }

  // log sukses
  await supabase.from("health_logs").insert({
    called_at: new Date().toISOString(),
    status: "success",
  });

  return { success: true };
});
