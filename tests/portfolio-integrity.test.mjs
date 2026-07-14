import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const sourceFiles = [
  "src/features/portfolio/ui/PortfolioPage.tsx",
  "src/features/portfolio/ui/PortfolioRuntime.tsx",
  "src/app/globals.css",
  "public/portfolio-runtime.js"
];

const sources = sourceFiles.map((file) => readFileSync(`${root}/${file}`, "utf8"));
const combinedSource = sources.join("\n");

test("all referenced portfolio assets exist", () => {
  const assetReferences = new Set(combinedSource.match(/\/assets\/[A-Za-z0-9._/-]+/g) ?? []);

  assert.ok(assetReferences.size > 0, "expected the portfolio to reference local assets");

  for (const assetReference of assetReferences) {
    const assetPath = `${root}/public${assetReference}`;
    assert.ok(existsSync(assetPath), `missing asset: ${assetReference}`);
  }
});

test("discarded portrait and hat concepts stay removed", () => {
  assert.doesNotMatch(
    combinedSource,
    /portrait-lab|chapeu|hat-hint|has-3d-hat/i,
    "discarded experimental code was found"
  );
  assert.match(combinedSource, /id="sigil-anchor"/, "abstract sigil anchor is missing");
});
