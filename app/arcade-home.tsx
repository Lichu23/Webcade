"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Game } from "../lib/game";
import { readFavorites, readRecentGames, writeFavorites, type RecentGame } from "../lib/personal";

function GameCard({ game, favorite, onToggleFavorite, playCount }: { game: Game; favorite: boolean; onToggleFavorite: () => void; playCount?: number }) {
  return <div className="game-card"><Link href={`/game/${game.slug}`}><div className="game-art" style={{ backgroundImage: game.thumbnail ? `url(${game.thumbnail})` : undefined }}>{!game.thumbnail && <span>{game.title.slice(0, 1).toUpperCase()}</span>}<div className="game-card-overlay"><span>Play now</span></div></div></Link><button className={`favorite-button ${favorite ? "is-favorite" : ""}`} type="button" aria-label={`${favorite ? "Remove" : "Add"} ${game.title} ${favorite ? "from favorites" : "to favorites"}`} aria-pressed={favorite} onClick={onToggleFavorite}>{favorite ? "?" : "?"}</button><Link className="game-card-copy" href={`/game/${game.slug}`}><strong>{game.title}</strong><span>{game.categories.slice(0, 2).join(" · ") || "Arcade"}{playCount ? ` · ${playCount} plays` : ""}</span></Link></div>;
}

export default function ArcadeHome({ games }: { games: Game[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All games");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<RecentGame[]>([]);
  useEffect(() => { setFavorites(readFavorites()); setRecent(readRecentGames()); }, []);
  const toggleFavorite = (slug: string) => setFavorites((current) => { const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]; writeFavorites(next); return next; });
  const categories = ["All games", ...new Set(games.flatMap((game) => game.categories))];
  const filtered = useMemo(() => { const normalized = query.trim().toLowerCase(); return games.filter((game) => { const matchesCategory = category === "All games" || game.categories.includes(category); const haystack = [game.title, game.description, game.creator.name, ...game.tags, ...(game.technology ?? [])].join(" ").toLowerCase(); return matchesCategory && (!normalized || haystack.includes(normalized)); }); }, [category, games, query]);
  const countFor = (slug: string) => recent.find((item) => item.slug === slug)?.playCount;
  const card = (game: Game) => <GameCard game={game} key={game.id} favorite={favorites.includes(game.slug)} onToggleFavorite={() => toggleFavorite(game.slug)} playCount={countFor(game.slug)} />;
  const personalized = (title: string, items: Game[]) => items.length > 0 && <section className="game-section"><SectionHeading title={title} detail={`${items.length} ${items.length === 1 ? "game" : "games"}`} /><div className="game-grid">{items.map(card)}</div></section>;
  const recentGames = recent.map((item) => games.find((game) => game.slug === item.slug)).filter((game): game is Game => Boolean(game)).filter((game) => filtered.includes(game));
  return <main className="site-shell"><header className="site-header"><Link className="brand" href="/">ASTRA <span>ARCADE</span></Link><label className="search-box"><span aria-hidden="true">?</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games, creators, tags..." aria-label="Search games" /></label></header><section className="hero"><div><p className="eyebrow">A private collection of browser experiments</p><h1>Pick a game.<br /><em>Start playing.</em></h1><p className="hero-copy">A focused arcade for curious games created and rebuilt with modern AI tools.</p></div><div className="hero-orbit" aria-hidden="true"><span>?</span><span>?</span><span>?</span></div></section><nav className="category-nav" aria-label="Game categories">{categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}</nav>{games.length === 0 ? <EmptyState /> : filtered.length === 0 ? <EmptyState message="No games match that search." /> : <>{personalized("Favorites", filtered.filter((game) => favorites.includes(game.slug)))}{personalized("Recently played", recentGames)}{filtered.some((game) => game.featured) && <section className="game-section"><SectionHeading title="Featured" detail="Hand-picked experiments" /><div className="game-grid">{filtered.filter((game) => game.featured).map(card)}</div></section>}<section className="game-section"><SectionHeading title={filtered.some((game) => game.featured) ? "More to explore" : "New games"} detail={`${filtered.filter((game) => !game.featured).length} games`} /><div className="game-grid">{filtered.filter((game) => !game.featured).map(card)}</div></section></>}<footer className="site-footer">Astra Arcade · Owner-curated · Built for discovery</footer></main>;
}
function SectionHeading({ title, detail }: { title: string; detail: string }) { return <div className="section-heading"><h2>{title}</h2><span>{detail}</span></div>; }
function EmptyState({ message = "Games are being prepared for the arcade." }: { message?: string }) { return <div className="empty-state"><span className="empty-icon">?</span><h2>{message}</h2><p>Games will appear here after they are imported, validated, and published from the terminal.</p></div>; }
