let cachedToken = null;
let tokenExpiry = 0;

export async function getAccessToken() {
  const config = useRuntimeConfig();
  const now = Date.now();

  // If token exists and is not expired (buffer 60 seconds)
  if (cachedToken && now < tokenExpiry - 60000) {
    return cachedToken;
  }

  try {
    const data = await $fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    });

    cachedToken = data.access_token;
    // expires_in is in seconds, convert to ms
    tokenExpiry = now + data.expires_in * 1000;

    return cachedToken;
  } catch (error) {
    console.error("Failed to fetch access token:", error);
    throw error;
  }
}
