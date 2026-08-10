import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const nextConfigSource = readFileSync(`${root}/next.config.ts`, "utf8");
const sourceFiles = [
  "src/features/portfolio/ui/PortfolioPage.tsx",
  "src/features/portfolio/ui/Silver3CasePage.tsx",
  "src/features/portfolio/ui/PortfolioRuntime.tsx",
  "src/app/cases/silver3/page.tsx",
  "src/app/globals.css",
  "public/portfolio-runtime.js",
  "public/silver3-case-runtime.js"
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

test("legacy language routes redirect to the canonical home", () => {
  assert.match(nextConfigSource, /source:\s*"\/pt"[\s\S]*?destination:\s*"\/"/);
  assert.match(nextConfigSource, /source:\s*"\/en"[\s\S]*?destination:\s*"\/"/);
});

test("Silver3 links to a dedicated case without claiming unavailable capabilities", () => {
  assert.ok(existsSync(`${root}/src/app/cases/silver3/page.tsx`), "Silver3 case route is missing");
  assert.match(combinedSource, /href="\/cases\/silver3"/, "Silver3 card does not link to its case");
  assert.doesNotMatch(
    combinedSource,
    /suporte a trabalho offline|offline support/i,
    "Silver3 must not claim unsupported offline mutations"
  );
  assert.doesNotMatch(
    combinedSource,
    /chatbot com IA|AI chatbot/i,
    "Silver3 must not present unvalidated AI automation as available"
  );
  assert.match(
    combinedSource,
    /Diferentes experiências\. Uma única plataforma\./i,
    "Silver3 must be presented as one product rather than separate products"
  );
  assert.doesNotMatch(
    combinedSource,
    /O Silver3 é (?:uma|a) (?:plataforma|sistema)/i,
    "Silver3 must be presented as the client rather than the product name"
  );
  assert.match(combinedSource, /Web[^\n]{0,80}em produção/i, "Silver3 must state the current Web status");
  assert.match(combinedSource, /app[^\n]{0,80}homologação/i, "Silver3 must state the current mobile status");
});
