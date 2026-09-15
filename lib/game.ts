export type PlayMode = "embedded" | "external" | "self-hosted";
export type GameStatus = "pending_review" | "published" | "rejected" | "disabled";
export type PlayableMode = PlayMode | "unavailable";

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  categories: string[];
  tags: string[];
  thumbnail: string;
  screenshots: string[];
  creator: { name: string; url?: string };
  play: { url: string; mode: PlayMode; fallbackUrl?: string };
  source?: { repository: string };
  technology?: string[];
  platform: { desktop: boolean; mobile: boolean; touch: boolean; keyboard: boolean; gamepad: boolean };
  ai?: { model?: string; tool?: string; evidence?: string };
  origin: "original" | "inspired" | "fan-remake";
  rights: { license?: string; redistribution: "allowed" | "unknown" | "not-allowed"; embedding: "allowed" | "unknown" | "not-allowed" };
  sourceCatalog: string;
  sourceEntry: string;
  featured: boolean;
  status: GameStatus;
  createdAt?: string;
  discoveredAt: string;
}

export interface PlayConfiguration {
  mode: PlayableMode;
  url?: string;
  fallbackUrl?: string;
  message?: string;
}

const isHttpUrl = (value: string | undefined): value is string => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const isSafeSelfHostedUrl = (value: string, slug: string) => value.startsWith(`/games/${slug}/`) && !value.includes("..") && !value.includes("\\");

/** Catalog metadata is an allow-list; incomplete records never become unsafe embeds. */
export function getPlayConfiguration(game: Game): PlayConfiguration {
  const fallbackUrl = isHttpUrl(game.play.fallbackUrl) ? game.play.fallbackUrl : undefined;

  if (game.play.mode === "external") {
    return isHttpUrl(game.play.url)
      ? { mode: "external", url: game.play.url }
      : { mode: "unavailable", message: "The creator's playable link is unavailable." };
  }

  if (game.play.mode === "embedded") {
    if (game.rights.embedding === "allowed" && isHttpUrl(game.play.url)) {
      return { mode: "embedded", url: game.play.url, fallbackUrl: fallbackUrl ?? game.play.url };
    }
    const externalUrl = fallbackUrl ?? (isHttpUrl(game.play.url) ? game.play.url : undefined);
    return externalUrl
      ? { mode: "external", url: externalUrl, message: "Embedding has not been approved, so this game opens on the creator's site." }
      : { mode: "unavailable", message: "This game does not have a safe playable link." };
  }

  if (game.rights.redistribution === "allowed" && isSafeSelfHostedUrl(game.play.url, game.slug)) {
    return { mode: "self-hosted", url: game.play.url, fallbackUrl };
  }

  return fallbackUrl
    ? { mode: "external", url: fallbackUrl, message: "The self-hosted build is not authorized for this catalog record." }
    : { mode: "unavailable", message: "The self-hosted build is not authorized for this catalog record." };
}
