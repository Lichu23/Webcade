import Link from "next/link";
import { notFound } from "next/navigation";
import games from "../../../data/games.json";
import type { Game } from "../../../lib/game";

const catalog = games as Game[];
export function generateStaticParams() { return catalog.filter((game) => game.status === "published").map((game) => ({ slug: game.slug })); }

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = catalog.find((item) => item.slug === slug && item.status === "published");
  if (!game) notFound();
  const similar = catalog.filter((item) => item.status === "published" && item.slug !== game.slug && item.categories.some((category) => game.categories.includes(category))).slice(0, 4);
  const playLabel = game.play.mode === "external" ? "Play original game ↗" : "Launch game";
  return <main className="site-shell detail-page"><header className="site-header"><Link className="back-link" href="/">← All games</Link><Link className="brand" href="/">ASTRA <span>ARCADE</span></Link></header><section className="game-hero"><div className="detail-art game-art" style={{ backgroundImage: game.thumbnail ? `url(${game.thumbnail})` : undefined }}>{!game.thumbnail && <span>{game.title.slice(0, 1).toUpperCase()}</span>}</div><div className="detail-intro"><p className="eyebrow">{game.categories.join(" · ") || "Arcade"}</p><h1>{game.title}</h1><p>{game.description}</p><a className="primary-button" href={game.play.url} target="_blank" rel="noreferrer">{playLabel}</a><p className="play-note">{game.play.mode === "external" ? "This game is played on the creator's original site." : "Opens the permitted playable version."}</p></div></section><section className="detail-grid"><div><h2>About this game</h2><p>{game.shortDescription || game.description}</p><div className="tag-list">{game.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><aside><h2>Credits</h2><p>Created by <CreatorLink creator={game.creator} /></p>{game.source?.repository && <p><a href={game.source.repository} target="_blank" rel="noreferrer">View source ↗</a></p>}<p className="muted">{game.origin === "original" ? "Original project" : game.origin === "inspired" ? "Inspired experiment" : "Fan experiment"}</p></aside></section>{similar.length > 0 && <section className="game-section"><div className="section-heading"><h2>You might also like</h2></div><div className="game-grid">{similar.map((item) => <Link className="game-card" href={`/game/${item.slug}`} key={item.id}><div className="game-art" style={{ backgroundImage: item.thumbnail ? `url(${item.thumbnail})` : undefined }}>{!item.thumbnail && <span>{item.title.slice(0, 1).toUpperCase()}</span>}</div><div className="game-card-copy"><strong>{item.title}</strong><span>{item.categories.slice(0, 2).join(" · ")}</span></div></Link>)}</div></section>}</main>;
}
function CreatorLink({ creator }: { creator: Game["creator"] }) { return creator.url ? <a href={creator.url} target="_blank" rel="noreferrer">{creator.name} ↗</a> : <span>{creator.name}</span>; }
