"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayConfiguration } from "../../../lib/game";
import { recordGamePlay } from "../../../lib/personal";

type RunnerState = "loading" | "ready" | "error" | "blocked";

export default function PlayRunner({ gameTitle, gameSlug, play }: { gameTitle: string; gameSlug: string; play: PlayConfiguration }) {
  const [state, setState] = useState<RunnerState>("loading");
  const [fullscreenError, setFullscreenError] = useState(false);
  const runnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setState("loading");
    setFullscreenError(false);
  }, [play.mode, play.url]);

  if (play.mode === "external") return <ExternalPlay gameTitle={gameTitle} href={play.url!} message={play.message} onPlay={() => recordGamePlay(gameSlug)} />;
  if (play.mode === "unavailable" || !play.url) return <section className="runner-unavailable" aria-live="polite"><p className="eyebrow">Play unavailable</p><h2>There is no authorized way to launch this game yet.</h2><p>{play.message ?? "The owner needs to review its playable link and permissions."}</p></section>;

  const openFallback = play.mode === "embedded" ? play.fallbackUrl ?? play.url : undefined;
  // External embedded games need their real origin so module scripts and other
  // same-origin assets are not treated as coming from an opaque `null` origin.
  // Self-hosted games intentionally remain opaque to prevent same-origin access.
  const sandbox = [
    "allow-forms",
    "allow-pointer-lock",
    "allow-popups",
    "allow-popups-to-escape-sandbox",
    "allow-scripts",
    ...(play.mode === "embedded" ? ["allow-same-origin"] : []),
  ].join(" ");
  const requestFullscreen = async () => {
    try {
      await runnerRef.current?.requestFullscreen();
      setFullscreenError(false);
    } catch {
      setFullscreenError(true);
    }
  };

  return <section className="game-runner" ref={runnerRef} aria-label={`Play ${gameTitle}`}>
    <div className="runner-toolbar"><span className="eyebrow">{play.mode === "self-hosted" ? "Authorized self-hosted build" : "Embedded from the creator's site"}</span><button type="button" className="runner-control" onClick={requestFullscreen}>Fullscreen</button></div>
    <div className="runner-frame-wrap">
      {state === "loading" && <div className="runner-state" aria-live="polite"><span className="runner-spinner" aria-hidden="true" />Loading game…</div>}
      {state === "error" && <RunnerFallback eyebrow={play.mode === "embedded" ? "Embedded play unavailable" : "Self-hosted game unavailable"} title={play.mode === "embedded" ? "The game could not be loaded." : "The authorized build could not be loaded."} description={play.mode === "embedded" ? "The playable site may be offline or refuse this browser." : "The owner needs to review the self-hosted files."} href={openFallback} />}
      {state === "blocked" && <RunnerFallback eyebrow="Embedded play unavailable" title="This site blocks embedded play." description="We do not bypass the creator's security settings. You can open the original game instead." href={openFallback} />}
      {state !== "blocked" && <iframe
        className={state === "ready" ? "game-frame is-ready" : "game-frame"}
        title={`${gameTitle} game`}
        src={play.url}
        sandbox={sandbox}
        allow="fullscreen; gamepad"
        referrerPolicy="no-referrer"
        onLoad={() => { setState("ready"); recordGamePlay(gameSlug); }}
        onError={() => setState("error")}
      />}
    </div>
    <div className="runner-help">
      <p>{play.mode === "embedded" ? "The game runs in a sandbox and cannot access Astra Arcade's origin." : "This authorized build is isolated from Astra Arcade's origin."}</p>
      {state === "ready" && play.mode === "embedded" && <button type="button" className="text-button" onClick={() => setState("blocked")}>Embed blocked? Open the original game</button>}
      {fullscreenError && <p className="runner-error" role="alert">Fullscreen is unavailable in this browser.</p>}
    </div>
  </section>;
}

function ExternalPlay({ gameTitle, href, message, onPlay }: { gameTitle: string; href: string; message?: string; onPlay: () => void }) {
  return <section className="external-play"><p className="eyebrow">Play on the original site</p><h2>{gameTitle} is hosted by its creator.</h2><p>{message ?? "This game opens in a new tab so the creator's original version and security settings are respected."}</p><a className="primary-button" href={href} target="_blank" rel="noopener noreferrer" onClick={onPlay}>Play original game ↗</a></section>;
}

function RunnerFallback({ eyebrow, title, description, href }: { eyebrow: string; title: string; description: string; href?: string }) {
  return <div className="runner-state runner-fallback" role="alert"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p>{href && <a className="primary-button" href={href} target="_blank" rel="noopener noreferrer">Open original game ↗</a>}</div>;
}
