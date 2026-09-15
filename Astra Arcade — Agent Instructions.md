# Astra Arcade

## Goal

Build a modern web arcade inspired by the simplicity and discoverability of Friv.

The application should be a private, owner-controlled arcade for browser games that I create or rebuild with AI coding tools such as GPT-6 Astra/Codex.

There is no public submission flow and no in-app “Add Game” screen. Games are added only from the terminal by the owner.

Users should be able to:

1. Open the website.
2. Immediately see a visual grid of games.
3. Search and filter games.
4. Click a game.
5. Play it directly when embedding/hosting is permitted, or open the creator's original playable version when it is not.
6. Discover similar games.
7. See the original inspiration, source, and attribution when applicable.

The product should feel like a modern version of Friv rather than a GitHub directory.

---

# Primary Data Sources

## Source 1 — Awesome GPT-6 Astra

Repository:

https://github.com/MartinDelophy/awesome-gpt-6-astra

This is the PRIMARY discovery source.

It currently contains roughly 100 browser games and interactive projects.

Extract from every applicable entry:

- title
- description
- category
- creator
- creator URL
- playable URL
- source repository
- screenshot/preview
- platform
- controls
- mobile support
- technology
- Astra/Codex attribution
- verification notes
- license when available

Do NOT assume that inclusion in this repository means the game or its assets can be redistributed.

---

## Source 2 — Awesome GPT-6 Astra Demos

Repository:

https://github.com/magiccreator-ai/awesome-gpt-6-astra

Use the Games & Playable Demos section as a secondary discovery source.

It contains additional projects and experiments such as:

- Rocket League-style game
- Minecraft-style world
- League of Legends browser clone
- Zork in 3D
- Jelly Baby Playground
- Three Kingdoms: Wind and Cloud
- PvZ: Garden Defenders
- Melon Lab
- Balatro Web Edition
- Mosswing

Deduplicate projects found in Source 1.

---

## Source 3 — Astra Games Casebook

https://github.com/zlxxlz1026/awesome-gpt-6-astra-casebook/blob/main/docs/categories/games.md

Use this as another discovery source.

It contains additional information about game-generation experiments, prompts, creators, technologies and original posts.

Do not automatically treat every case as a playable game.

---

# Important Content Rule

There are three different kinds of entries.

### ORIGINAL

An original game created by its developer.

Example:

Mosswing

These are preferred.

### INSPIRED

A new game clearly inspired by an existing game or genre but using its own implementation/assets.

Example:

"Rocket League-style car soccer"

These can appear in the catalog when the creator permits distribution or embedding.

### FAN REMAKE / CLONE

A recreation of an existing commercial game.

Examples could include:

- League of Legends clone
- Minecraft clone
- Mario recreation
- Balatro recreation
- PvZ recreation

These require additional care.

Never automatically copy or redistribute proprietary:

- artwork
- characters
- music
- sounds
- maps
- textures
- logos
- trademarks
- extracted game files

A publicly accessible demo does NOT automatically mean we have permission to rehost it.

When redistribution rights are unclear, link to the creator's original playable version instead.

---

# Game Database

Create a normalized game schema.

Example:

```ts
interface Game {
  id: string;
  slug: string;

  title: string;
  description: string;
  shortDescription: string;

  categories: string[];
  tags: string[];

  thumbnail: string;
  screenshots: string[];

  creator: {
    name: string;
    url?: string;
  };

  play: {
    url: string;
    mode: "embedded" | "external" | "self-hosted";
  };

  source?: {
    repository: string;
  };

  technology?: string[];

  platform: {
    desktop: boolean;
    mobile: boolean;
    touch: boolean;
    keyboard: boolean;
    gamepad: boolean;
  };

  ai?: {
    model?: string;
    tool?: string;
    evidence?: string;
  };

  origin: "original" | "inspired" | "fan-remake";

  rights: {
    license?: string;
    redistribution: "allowed" | "unknown" | "not-allowed";
    embedding: "allowed" | "unknown" | "not-allowed";
  };

  sourceCatalog: string;
  sourceEntry: string;

  featured: boolean;
  createdAt?: string;
  discoveredAt: string;
}
```

---

# Owner-Controlled Import Workflow

Create a terminal ingestion pipeline rather than manually maintaining games through an admin view.

Pipeline:

```text
Source catalog or local game build
      ↓
Owner selects a game
      ↓
Fetch source or use an authorized local build
      ↓
Normalize metadata
      ↓
Check rights and playable URL
      ↓
Test iframe embedding
      ↓
Store catalog record
      ↓
Owner publishes with a terminal command
```
Never automatically publish newly discovered games. Importing is not publishing.

Give new games:

```text
status = pending_review
```

until the owner has checked metadata, attribution, rights, and embedding behavior.

The intended commands are:

```text
pnpm arcade discover
pnpm arcade import <source-or-local-path>
pnpm arcade validate <slug>
pnpm arcade publish <slug>
pnpm arcade deploy
```

The CLI must update the catalog and deployment artifacts. It must not require a web form.

---

# Website

## Homepage

Build a visual game grid similar to Friv.

Desktop should show many games simultaneously.

Each tile should prioritize the game's artwork.

Avoid excessive text on the homepage.

Example:

```text
┌─────────────────────────────────────────────────────────┐
│ ASTRA ARCADE                         🔎 Search           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔥 Trending   ✨ New   🏎 Racing   ⚔ Action   🧠 Puzzle │
│                                                         │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│ │GAME │ │GAME │ │GAME │ │GAME │ │GAME │ │GAME │      │
│ │     │ │     │ │     │ │     │ │     │ │     │      │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│                                                         │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│ │GAME │ │GAME │ │GAME │ │GAME │ │GAME │ │GAME │      │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Hovering a tile should reveal:

- title
- genre
- creator
- Play button

---

# Game Page

Route:

```text
/game/[slug]
```

Example layout:

```text
┌──────────────────────────────────────────────────────┐
│ ← Games                             ASTRA ARCADE     │
├──────────────────────────────────────────────────────┤
│                                                      │
│                                                      │
│                    GAME                              │
│                                                      │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Fullscreen     ❤️ Favorite       Share              │
└──────────────────────────────────────────────────────┘

GAME TITLE

Description

Created by: ...
Built with: Astra / Codex / Three.js

Tags:
Action · 3D · Racing

Source
Original project
Report game

SIMILAR GAMES

[game] [game] [game] [game]
```

---

# Game Runner

Support three modes.

## Self-hosted

Only for games that I created, rebuilt with permission, or otherwise have the right to redistribute.

Serve the game from:

```text
/games/{slug}/
```

## Embedded

When the original creator permits embedding and browser security headers allow it. This mode does not download or modify the original game.

Use a sandboxed iframe.

If the original server blocks framing with `X-Frame-Options` or CSP `frame-ancestors`, do not bypass it. Fall back to an external link.

## External

When redistribution or embedding permission is unclear.

The Play button should open the creator's original game.

Do NOT bypass:

- X-Frame-Options
- CSP frame restrictions
- authentication
- paywalls
- origin restrictions

Do not proxy another person's game simply to defeat embedding restrictions.

---

# Categories

Initial categories:

- Action
- Arcade
- Adventure
- Racing
- Platformer
- Shooter
- Strategy
- Simulation
- Puzzle
- Sports
- RPG
- Survival
- Multiplayer
- Experimental
- Physics
- 3D
- Casual

A game can belong to multiple categories.

---

# Discovery

Homepage sections:

- Featured
- Trending
- New Games
- Recently Added
- Racing
- Action
- Strategy
- Puzzle
- Multiplayer
- Original Games
- Fan Experiments

Implement:

```text
/search?q=
/category/racing
/category/action
/category/puzzle
/new
/trending
```

---

# Search

Search across:

- title
- description
- creator
- tags
- original/inspiration
- technology

Typo tolerance is desirable.

Examples:

```text
minecraft
racing
three.js
astra
multiplayer
physics
```

---

# Favorites and History

Initially use localStorage.

Store:

```text
favorites
recentlyPlayed
playCount
```

An account should NOT be required to play.

Accounts can be added later for synchronization.

---

# Owner Operations

Do not create public upload or add-game views. Owner operations are terminal-only.

Create CLI operations for:

```text
arcade discover
arcade import
arcade validate
arcade publish
arcade unpublish
arcade update
arcade check-links
```

The owner must be able to:

- edit metadata
- approve imported game
- reject game
- disable game
- mark featured
- change categories
- change thumbnail
- change playable URL
- change embed mode
- record license
- record redistribution permission
- report broken link

---

# Automated Link Checker

Periodically verify playable URLs.

Track:

```text
online
offline
redirected
unknown
```

Do NOT delete a game automatically because its URL temporarily fails.

Flag it for review.

---

# Discovery Agent

Create an agent/job whose purpose is to find NEW browser games matching this project.

Sources can include:

- GitHub
- creator websites
- itch.io
- Reddit
- X posts when discoverable
- community curated repositories

Search for concepts such as:

```text
GPT-6 Astra game
Astra browser game
Astra Three.js game
Codex browser game
AI generated browser game
Astra game clone
Astra game remake
Astra game recreation
Three.js game remake
WebGL game remake
```

The discovery agent MUST NOT automatically publish findings.

Produce candidates for human review.

---

# Deduplication

Determine duplicates using:

- normalized title
- playable URL
- repository URL
- creator
- similarity

Prefer the original creator's source over mirrors.

Never replace an original source with an aggregator.

---

# Attribution

Every game page should prominently preserve creator attribution.

Example:

```text
Created by John Doe
Original project ↗
Source code ↗
```

The arcade should function as a discovery layer for creators, not erase their attribution.

---

# Technical Stack

Recommended:

```text
Next.js
TypeScript
Tailwind CSS

PostgreSQL
Prisma

Next.js API routes/server actions

Vercel
```

For an MVP, static JSON can replace PostgreSQL:

```text
/data/games.json
```

Design the repository so migrating from JSON to PostgreSQL later is straightforward.

---

# Performance

The homepage may eventually contain hundreds or thousands of games.

Therefore:

- lazy-load thumbnails
- optimize images
- virtualize very large grids if necessary
- cache catalog requests
- avoid loading game bundles on homepage
- load the actual game only after Play
- use CDN caching
- preload only critical assets

Target excellent Core Web Vitals.

---

# Security

Third-party games are untrusted content.

Never execute arbitrary imported JavaScript in the application's own origin.

Embedded games must be isolated appropriately.

Do not give imported games access to:

- authentication tokens
- application cookies
- database credentials
- internal APIs
- local application secrets

Treat every imported game as potentially hostile.

---

# MVP Completion Plan

Complete the application in these six phases. Do not add unrelated features before the current phase is working.

## Phase 1 — Foundation and catalog

- [x] Create the Next.js/TypeScript application.
- [x] Create the normalized game schema and catalog storage.
- [x] Add terminal-only `discover`, `import`, `validate`, and `publish` commands.
- [ ] Import and normalize the selected games from the main Astra catalog.

## Phase 2 — Public arcade experience

- [ ] Build the Friv-style homepage grid and game cards.
- [ ] Add search, categories, featured games, and new games.
- [ ] Add `/game/[slug]` detail pages with attribution and source links.

## Phase 3 — Play modes

- [ ] Implement external play links.
- [ ] Implement iframe embedding when the original site permits it.
- [ ] Implement self-hosted files only for authorized games.
- [ ] Add fullscreen, loading, error, and blocked-embed states.

## Phase 4 — Personal features

- [ ] Add favorites with `localStorage`.
- [ ] Add recently played and play counts.
- [ ] Add similar-game recommendations.

## Phase 5 — Reliability and safety

- [ ] Add terminal link checking with `online`, `offline`, `redirected`, and `unknown` states.
- [ ] Isolate self-hosted games from application credentials and sensitive APIs.
- [ ] Verify attribution, source URLs, permissions, and iframe behavior for every published game.

## Phase 6 — Release

- [ ] Import the remaining approved games.
- [ ] Run the full validation and link report.
- [ ] Deploy the arcade.
- [ ] Confirm the complete flow: discover → import → validate → publish → play.

The first milestone is:

> A user visits the website, sees a beautiful Friv-style wall of selected browser games, clicks one, and can start playing with minimal friction.
# Future Direction

The application should NOT remain specifically dependent on GPT-6 Astra.

Architect the catalog around:

> "Interesting games recreated or created for the browser with modern AI-assisted development."

Later sources/models/tools may include other Codex models and other AI coding systems.

The database therefore should not use Astra-specific fields as fundamental architecture.

Use generic fields such as:

```ts
ai.model
ai.tool
ai.evidence
```

---

# Agent Execution Order

Agent 1:
Build the terminal importer and initial normalized games dataset.

Agent 2:
Design database/schema and ingestion pipeline.

Agent 3:
Build Friv-style frontend.

Agent 4:
Build game runner and isolation system.

Agent 5:
Build search/categories/recommendations.

Agent 6:
Build owner-only terminal discovery and publishing workflow.

Agent 7:
Audit licenses, attribution, iframe isolation and security.

Agent 8:
Test all playable links and produce a report of working/broken/external-only games.

Do not fabricate missing metadata.

Do not add public submission, account creation, or in-app game-upload features unless this document is explicitly changed later.

If information cannot be verified, store it as unknown.

Always preserve the original source URL and creator attribution.
