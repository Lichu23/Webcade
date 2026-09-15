export type PlayMode = "embedded" | "external" | "self-hosted";
export type GameStatus = "pending_review" | "published" | "rejected" | "disabled";

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
  play: { url: string; mode: PlayMode };
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
