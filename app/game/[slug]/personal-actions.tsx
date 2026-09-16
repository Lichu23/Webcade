"use client";
import { useEffect, useState } from "react";
import { readFavorites, writeFavorites } from "../../../lib/personal";
export default function PersonalActions({ slug, title }: { slug: string; title: string }) {
  const [favorite, setFavorite] = useState(false);
  useEffect(() => setFavorite(readFavorites().includes(slug)), [slug]);
  const toggle = () => setFavorite((current) => { const next = current ? readFavorites().filter((item) => item !== slug) : [...readFavorites(), slug]; writeFavorites(next); return !current; });
  return <button type="button" className={`favorite-detail ${favorite ? "is-favorite" : ""}`} onClick={toggle} aria-pressed={favorite}>{favorite ? "? Saved to favorites" : "? Add to favorites"}<span className="sr-only">: {title}</span></button>;
}
