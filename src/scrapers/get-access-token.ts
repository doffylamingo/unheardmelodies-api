export async function getAccessToken(): Promise<string> {
  const res = await fetch("https://everynoise.com/research.cgi");

  const html = await res.text();

  const tokenRegex = /'Bearer ([A-Za-z0-9-_]+)'/;
  const match = html.match(tokenRegex);

  if (!match) return "";

  return match[0].split(" ")[1];
}
