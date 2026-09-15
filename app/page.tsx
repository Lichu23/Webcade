import games from "../data/games.json";
import ArcadeHome from "./arcade-home";
import type { Game } from "../lib/game";

export default function Home() {
  const publishedGames = (games as Game[]).filter((game) => game.status === "published");
  return <ArcadeHome games={publishedGames} />;
}
