import games from "../data/games.json";

export default function Home() {
  return (
    <main>
      <h1>Astra Arcade</h1>
      <p>Private catalogue. Games are added through the terminal.</p>
      <p>{games.length} published games</p>
    </main>
  );
}
