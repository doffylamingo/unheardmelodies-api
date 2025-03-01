export const generateCodeVerifier = (): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from(crypto.getRandomValues(new Uint8Array(64)))
    .map((x) => possible[x % possible.length])
    .join("");
};

export const generateCodeChallenge = async (
  code_verifier: string,
): Promise<string> => {
  const data = new TextEncoder().encode(code_verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
