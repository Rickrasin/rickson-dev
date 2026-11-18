import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

const source = readFileSync(new URL("../src/app/tray/clarityTracking.ts", import.meta.url), "utf8");
const { outputText } = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ES2022 } });
const { createTrayClarity, clarityContactEvent, readClarityChoice, saveClarityChoice } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

function environment(pathname = "/tray", hostname = "rickson.dev") {
  const scripts = [];
  const listeners = new Map();
  const win = {
    location: { pathname, hostname },
    addEventListener(name, handler) { listeners.set(name, handler); },
    removeEventListener(name, handler) { if (listeners.get(name) === handler) listeners.delete(name); }
  };
  const doc = {
    visibilityState: "visible",
    head: { appendChild(script) { scripts.push(script); } },
    getElementById(id) { return scripts.find(script => script.id === id) || null; },
    createElement() { return {}; },
    addEventListener(name, handler) { listeners.set(name, handler); },
    removeEventListener(name, handler) { if (listeners.get(name) === handler) listeners.delete(name); }
  };
  return { win, doc, scripts, listeners };
}

test("Clarity waits for consent and only loads in production on the Tray route and host", () => {
  for (const [path, host, production] of [["/", "rickson.dev", true], ["/tray", "localhost", true], ["/tray", "rickson.dev.evil.test", true], ["/tray", "rickson.dev", false]]) {
    const env = environment(path, host);
    const controller = createTrayClarity(env.win, env.doc, production);
    controller.enable();
    assert.equal(env.scripts.length, 0);
  }
  const env = environment();
  const controller = createTrayClarity(env.win, env.doc, true);
  assert.equal(env.scripts.length, 0);
  controller.disable();
  assert.equal(env.scripts.length, 0);
  controller.enable();
  assert.equal(env.scripts.length, 1);
  assert.equal(env.scripts[0].async, true);
  assert.equal(env.scripts[0].referrerPolicy, "no-referrer");
  assert.ok(env.win.clarity.q.some(call => call[0] === "consentv2" && call[1].analytics_Storage === "granted" && call[1].ad_Storage === "denied"));
});

test("re-enabling, returning to the landing and remounting never duplicate the loader", () => {
  const env = environment();
  let controller = createTrayClarity(env.win, env.doc, true);
  controller.enable();
  controller.enable();
  controller.disable();
  controller.enable();
  controller.dispose();
  controller = createTrayClarity(env.win, env.doc, true);
  controller.enable();
  assert.equal(env.scripts.length, 1);
  assert.equal(env.win.clarity.q.at(-1)[1].analytics_Storage, "granted");
});

test("revoking consent or leaving during a pending load stops collection and removes listeners", () => {
  const env = environment();
  const controller = createTrayClarity(env.win, env.doc, true);
  controller.enable();
  controller.disable();
  env.scripts[0].onload();
  assert.deepEqual(env.win.clarity.q.at(-1), ["stop"]);
  assert.ok(env.win.clarity.q.some(call => call[0] === "consentv2" && call[1].analytics_Storage === "denied"));
  controller.dispose();
  env.win.location.pathname = "/";
  env.scripts[0].onload();
  controller.enable();
  assert.deepEqual(env.win.clarity.q.at(-1), ["stop"]);
  assert.equal(env.listeners.size, 0);
});

test("WhatsApp is recorded as a safe event and stopped before its URL can reach the SDK click listener", () => {
  const env = environment();
  const controller = createTrayClarity(env.win, env.doc, true);
  controller.enable();
  const anchor = { href: "https://wa.me/552139551042?text=mensagem-privada", getAttribute: () => "tray-hero" };
  const event = { target: { closest: () => anchor }, preventDefault() { throw new Error("must not block contact"); } };
  env.listeners.get("click")(event);
  assert.deepEqual(env.win.clarity.q.slice(-2), [["event", "whatsapp_click_tray_hero"], ["stop"]]);
  assert.doesNotMatch(JSON.stringify(env.win.clarity.q), /552139551042|mensagem-privada|wa\.me/);
  env.listeners.get("focus")();
  assert.equal(env.scripts.length, 1);
  assert.ok(env.win.clarity.q.some(call => call[0] === "start"));
});

test("failed or blocked Clarity leaves native contact and analytics failure paths harmless", () => {
  const env = environment();
  const controller = createTrayClarity(env.win, env.doc, true);
  controller.enable();
  env.win.clarity = () => { throw new Error("tracker blocked"); };
  assert.doesNotThrow(() => env.scripts[0].onerror());
  assert.doesNotThrow(() => controller.enable());
  assert.doesNotThrow(() => controller.disable());
  assert.doesNotThrow(() => controller.dispose());
  assert.equal(env.scripts.length, 1);
});

test("contact events only accept the expected phone and a fixed placement allowlist", () => {
  assert.equal(clarityContactEvent("https://wa.me/552139551042?text=private", "stores-mobile"), "whatsapp_click_stores_mobile");
  for (const [href, placement] of [["https://wa.me.evil.test/552139551042", "tray-hero"], ["https://wa.me/5511999999999", "tray-hero"], ["javascript:alert(1)", "tray-hero"], ["https://wa.me/552139551042", "private-name"], ["https://wa.me/552139551042", null]]) {
    assert.equal(clarityContactEvent(href, placement), undefined);
  }
});

test("missing, invalid, expired or inaccessible consent always defaults to no collection", () => {
  const now = Date.now();
  for (const value of [null, "broken", JSON.stringify({ choice: "accepted", savedAt: now + 1000 }), JSON.stringify({ choice: "accepted", savedAt: now - 181 * 86400000 })]) {
    assert.equal(readClarityChoice({ getItem: () => value }, now), "unknown");
  }
  assert.equal(readClarityChoice({ getItem() { throw new Error("disabled"); } }), "unknown");
  assert.equal(readClarityChoice({ getItem: () => JSON.stringify({ choice: "declined", savedAt: now }) }, now), "declined");
  assert.doesNotThrow(() => saveClarityChoice({ setItem() { throw new Error("disabled"); } }, "declined"));
});
