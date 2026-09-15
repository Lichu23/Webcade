#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const catalogPath = path.join(root, "data", "games.json");
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
const readCatalog = () => readJson(catalogPath);
const writeCatalog = (games) => fs.writeFileSync(catalogPath, `${JSON.stringify(games, null, 2)}\n`);
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fail = (message) => { console.error(`Error: ${message}`); process.exitCode = 1; };
const usage = () => console.log("Usage: pnpm arcade <discover|import|validate|publish> ...");

function discover(source = "") {
  if (!source) return fail("discover requires a local Markdown file; no remote content is downloaded.");
  const sourcePath = path.resolve(root, source);
  if (!fs.existsSync(sourcePath)) return fail(`source does not exist: ${source}`);
  const text = fs.readFileSync(sourcePath, "utf8");
  const links = [...text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)].map(([, title, url]) => ({ title, url }));
  console.log(JSON.stringify({ source: sourcePath, candidates: links }, null, 2));
  console.log("Discovery only reports candidates; it does not download or publish games.");
}

function importGame(input) {
  if (!input) return fail("import requires a local game directory containing manifest.json.");
  const dir = path.resolve(root, input);
  const manifestPath = path.join(dir, "manifest.json");
  if (!fs.existsSync(manifestPath)) return fail("manifest.json is required; metadata will not be fabricated.");
  const manifest = readJson(manifestPath);
  const slug = manifest.slug || slugify(manifest.title || "");
  if (!slug || !manifest.title) return fail("manifest.title is required.");
  const games = readCatalog();
  if (games.some((game) => game.slug === slug)) return fail(`duplicate slug: ${slug}`);
  const now = new Date().toISOString();
  const game = { ...manifest, id: manifest.id || crypto.randomUUID(), slug, status: "pending_review", discoveredAt: manifest.discoveredAt || now };
  games.push(game);
  writeCatalog(games);
  console.log(`Imported ${slug} as pending_review. Run validate, then publish explicitly.`);
}

function validate(slug) {
  const game = readCatalog().find((item) => item.slug === slug);
  if (!game) return fail(`game not found: ${slug}`);
  const required = ["id", "slug", "title", "description", "shortDescription", "categories", "tags", "thumbnail", "screenshots", "creator", "play", "platform", "origin", "rights", "sourceCatalog", "sourceEntry", "featured", "status", "discoveredAt"];
  const missing = required.filter((key) => game[key] === undefined || game[key] === null);
  const errors = [...missing.map((key) => `missing ${key}`)];
  if (!game.play?.url) errors.push("play.url is required");
  if (!game.creator?.name) errors.push("creator.name is required");
  if (!['embedded', 'external', 'self-hosted'].includes(game.play?.mode)) errors.push("play.mode is invalid");
  if (!['allowed', 'unknown', 'not-allowed'].includes(game.rights?.embedding)) errors.push("rights.embedding is invalid");
  if (errors.length) return fail(errors.join("; "));
  console.log(`Valid: ${slug} (${game.status})`);
}

function publish(slug) {
  const games = readCatalog();
  const index = games.findIndex((item) => item.slug === slug);
  if (index < 0) return fail(`game not found: ${slug}`);
  const game = games[index];
  if (game.status !== "pending_review") return fail(`only pending_review games can be published (current: ${game.status})`);
  validate(slug);
  if (process.exitCode) return;
  games[index] = { ...game, status: "published", createdAt: game.createdAt || new Date().toISOString() };
  writeCatalog(games);
  console.log(`Published ${slug}.`);
}

const [, , command, argument] = process.argv;
if (command === "discover") discover(argument);
else if (command === "import") importGame(argument);
else if (command === "validate") validate(argument);
else if (command === "publish") publish(argument);
else usage();
