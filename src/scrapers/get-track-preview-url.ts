import * as cheerio from "cheerio";

export async function getSpotifyPreviewUrl(id: string): Promise<string> {
  const res = await fetch(`https://embed.spotify.com/?uri=spotify:track:${id}`);

  const data = await res.text();

  const $ = cheerio.load(data);

  const scriptTag = $("script#__NEXT_DATA__").html();

  const jsonData = JSON.parse(scriptTag!);

  const audioPreviewUrl =
    jsonData.props.pageProps.state.data.entity.audioPreview.url;

  if (!audioPreviewUrl) return "";

  return audioPreviewUrl;
}
