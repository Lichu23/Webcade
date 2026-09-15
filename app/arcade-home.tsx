"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Game } from "../lib/game";

function GameCard({ game }: { game: Game }) {
  return <Link className="game-card" href={`/game/${game.slug}`}><div className="game-art" style={{ backgroundImage: game.thumbnail ? `url(${game.thumbnail})` : undefined }}>{!game.thumbnail && <span>{game.title.slice(0, 1).toUpperCase()}</span>}<div className="game-card-overlay"><span>Play now</span></div></div><div className="game-card-copy"><strong>{game.title}</strong><span>{game.categories.slice(0, 2).join(" · ") || "Arcade"}</span></div></Link>;
}

export default function ArcadeHome({ games }: { games: Game[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All games");
  const categories = ["All games", ...new Set(games.flatMap((game) => game.categories))];
  const filtered = useMemo(() => { const normalized = query.trim().toLowerCase(); return games.filter((game) => { const matchesCategory = category === "All games" || game.categories.includes(category); const haystack = [game.title, game.description, game.creator.name, ...game.tags, ...(game.technology ?? [])].join(" ").toLowerCase(); return matchesCategory && (!normalized || haystack.includes(normalized)); }); }, [category, games, query]);
  const featured = filtered.filter((game) => game.featured);
  const fresh = filtered.filter((game) => !game.featured);
  return <main className="site-shell"><header className="site-header"><Link className="brand" href="/">ASTRA <span>ARCADE</span></Link><label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games, creators, tags..." aria-label="Search games" /></label></header><section className="hero"><div><p className="eyebrow">A private collection of browser experiments</p><h1>Pick a game.<br /><em>Start playing.</em></h1><p className="hero-copy">A focused arcade for curious games created and rebuilt with modern AI tools.</p></div><div className="hero-orbit" aria-hidden="true"><span>✦</span><span>◒</span><span>◆</span></div></section><nav className="category-nav" aria-label="Game categories">{categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}</nav>{games.length === 0 ? <EmptyState /> : filtered.length === 0 ? <EmptyState message="No games match that search." /> : <>{featured.length > 0 && <section className="game-section"><SectionHeading title="Featured" detail="Hand-picked experiments" /><div className="game-grid">{featured.map((game) => <GameCard game={game} key={game.id} />)}</div></section>}{fresh.length > 0 && <section className="game-section"><SectionHeading title={featured.length ? "More to explore" : "New games"} detail={`${filtered.length} ${filtered.length === 1 ? "game" : "games"}`} /><div className="game-grid">{fresh.map((game) => <GameCard game={game} key={game.id} />)}</div></section>}</>}<footer className="site-footer">Astra Arcade · Owner-curated · Built for discovery</footer></main>;
}

function SectionHeading({ title, detail }: { title: string; detail: string }) { return <div className="section-heading"><h2>{title}</h2><span>{detail}</span></div>; }
function EmptyState({ message = "Games are being prepared for the arcade." }: { message?: string }) { return <div className="empty-state"><span className="empty-icon">✦</span><h2>{message}</h2><p>Games will appear here after they are imported, validated, and published from the terminal.</p></div>; }
