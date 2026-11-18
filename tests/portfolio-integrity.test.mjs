import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const nextConfigSource = readFileSync(`${root}/next.config.ts`, "utf8");
const sourceFiles = [
  "src/features/portfolio/ui/PortfolioPage.tsx",
  "src/features/portfolio/ui/Silver3CasePage.tsx",
  "src/features/portfolio/ui/PortfolioRuntime.tsx",
  "src/features/portfolio/ui/MagicRouteTransition.tsx",
  "src/app/cases/silver3/page.tsx",
  "src/app/globals.css",
  "public/portfolio-runtime.js",
  "public/silver3-case-runtime.js"
];

const sources = sourceFiles.map((file) => readFileSync(`${root}/${file}`, "utf8"));
const combinedSource = sources.join("\n");
const silver3Source = readFileSync(`${root}/src/features/portfolio/ui/Silver3CasePage.tsx`, "utf8");
const portfolioRuntimeSource = readFileSync(`${root}/public/portfolio-runtime.js`, "utf8");
const portfolioPageSource = readFileSync(`${root}/src/features/portfolio/ui/PortfolioPage.tsx`, "utf8");

test("store section links to a dedicated WhatsApp conversation", () => {
  assert.match(portfolioPageSource, /data-section-target="ecommerce" href="#lojas-virtuais"/);
  assert.match(portfolioPageSource, /data-section="ecommerce" id="lojas-virtuais"/);
  assert.match(portfolioPageSource, /data-ecommerce-whatsapp[^>]*href=\{ecommerceWhatsappUrl\}/);
  assert.match(portfolioRuntimeSource, /dictionary\["ecommerce.whatsapp.message"\]/);
  assert.match(portfolioRuntimeSource, /if \(sectionName === "ecommerce"\)/);
});

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

test("performance safeguards keep browser work under control", () => {
  const optimizedThreePath = `${root}/public/assets/three.module.min.js`;

  assert.ok(existsSync(optimizedThreePath), "the optimized Three.js runtime is missing");
  assert.ok(statSync(optimizedThreePath).size < 700 * 1024, "the Three.js runtime grew beyond the size budget");
  assert.doesNotMatch(combinedSource, /\bunoptimized\b/, "portfolio images must use responsive optimization");
  assert.match(combinedSource, /strategy="afterInteractive"/, "visual runtimes must load after hydration to coordinate entrance animations");
  assert.match(combinedSource, /portfolio-visuals-pause/, "route changes must pause continuous visual work");
  assert.match(combinedSource, /visualQuality/, "visual runtimes must expose their adaptive quality mode");
  assert.match(combinedSource, /failIfMajorPerformanceCaveat/, "visual runtimes must detect software rendering when possible");
  assert.ok((combinedSource.match(/const targetFps = 60/g) || []).length >= 2, "all visual profiles must target 60 FPS");
  assert.doesNotMatch(combinedSource, /assets\/three\.module\.js/, "visual runtimes must not load the unminified Three.js build");
});

test("fixed page chrome keeps a stable scrollbar gutter", () => {
  assert.match(
    combinedSource,
    /scrollbar-gutter:\s*stable/,
    "the viewport gutter must stay reserved to prevent fixed chrome layout shifts"
  );
});

test("Silver3 keeps the character-by-character language morph", () => {
  assert.match(silver3Source, /const languageGlyphs =/i, "Silver3 language glyphs are missing");
  assert.match(silver3Source, /pendingLanguageMorph/i, "Silver3 does not preserve the outgoing copy");
  assert.match(silver3Source, /requestAnimationFrame/i, "Silver3 language morph is not animated frame by frame");
  assert.ok(
    (silver3Source.match(/data-s3-i18n/g) || []).length >= 30,
    "all visible Silver3 copy must participate in the language morph"
  );
  assert.doesNotMatch(
    silver3Source,
    /<strong data-s3-i18n>/,
    "hidden rail labels must not become visible during the language morph"
  );
});

test("interactive motion stays active independently of the operating system preference", () => {
  assert.doesNotMatch(
    combinedSource,
    /reducedMotionQuery|\breducedMotion\b/,
    "the operating system preference must not silently skip portfolio motion"
  );
  assert.match(portfolioRuntimeSource, /function prepareTextMorphs/, "home morph measurements are not batched");
  assert.match(portfolioRuntimeSource, /function runTextScramble/, "home language morph has no shared scheduler");
  assert.doesNotMatch(
    portfolioRuntimeSource,
    /function scrambleTextElement/,
    "home language morph must not start one animation loop per text element"
  );
});

test("visual runtime cache versions stay synchronized", () => {
  const runtimeVersions = combinedSource.match(/(?:portfolio|silver3-case)-runtime\.js\?v=([A-Za-z0-9-]+)/g) ?? [];
  assert.ok(runtimeVersions.length >= 4, "expected every runtime entry point to be versioned");
  assert.ok(
    runtimeVersions.every((reference) => reference.endsWith("20261118-lojas-padrao")),
    "runtime entry points must use the same fresh cache version"
  );
});

test("preferences survive unavailable graphics and browser storage", () => {
  assert.match(portfolioRuntimeSource, /visualQuality = "static"/, "home has no static fallback when WebGL fails");
  assert.match(portfolioRuntimeSource, /function readPreference/, "home preference reads are not protected");
  assert.match(portfolioRuntimeSource, /function writePreference/, "home preference writes are not protected");
  assert.match(silver3Source, /function readStoredPreference/, "Silver3 preference reads are not protected");
  assert.match(silver3Source, /volatileLanguage/, "Silver3 cannot change language when storage is blocked");
});

test("active case navigation is exposed to assistive technology", () => {
  assert.match(silver3Source, /aria-current=.*location/, "Silver3 has no initial current navigation item");
  assert.match(combinedSource, /setAttribute\("aria-current", "location"\)/, "runtime navigation does not announce the active section");
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
