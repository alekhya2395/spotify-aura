export function isGroqConfigured(): boolean {
  const key = process.env.GROQ_API_KEY;
  return Boolean(key && key.trim());
}

export function isSpotifyConfigured(): boolean {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  return Boolean(
    clientId &&
      clientSecret &&
      clientId !== "your_client_id" &&
      clientSecret !== "your_client_secret"
  );
}
