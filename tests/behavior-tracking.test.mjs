import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

const source = readFileSync(new URL("../src/features/analytics/behaviorTracking.ts", import.meta.url), "utf8");
const { outputText } = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ES2022 } });
const { behaviorConsentKey, readBehaviorChoice, saveBehaviorChoice, eligiblePage, safePageUrl, contactProperties, sanitizeBehaviorEvent, maskReplayAttribute, behaviorConfig, createBehaviorTracking } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

function environment(href = "https://rickson.dev/tray") {
  const listeners = new Map();
  const calls = [];
  let config;
  const win = { location: new URL(href) };
  const doc = {
    addEventListener(name, handler) { listeners.set(name, handler); },
    removeEventListener(name, handler) { if (listeners.get(name) === handler) listeners.delete(name); }
  };
  const sdk = {
    init(token, options) { calls.push(["init", token]); config = options; },
    capture(name, properties) { const event = config.before_send({ uuid: "test", event: name, properties }); if (event) calls.push([name, event.properties]); },
    set_config(options) { calls.push(["config", options]); },
    opt_in_capturing() { calls.push(["opt-in"]); },
    opt_out_capturing() { calls.push(["opt-out"]); },
    startSessionRecording() { calls.push(["start"]); },
    stopSessionRecording() { calls.push(["stop"]); },
    reset() { calls.push(["reset"]); }
  };
  return { win, doc, sdk, calls, listeners, config: () => config };
}
const create = (env, production = true, load = async () => env.sdk) => createBehaviorTracking(env.win, env.doc, production, "public-test-token", "https://test.invalid", load);

test("PostHog requires its own unexpired consent, never an old Clarity preference", () => {
  const values = new Map([["rickson-tray-clarity-consent-v1", JSON.stringify({ choice: "accepted", savedAt: Date.now() })]]);
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  assert.equal(readBehaviorChoice(storage), "unknown");
  saveBehaviorChoice(storage, "accepted");
  assert.equal(readBehaviorChoice(storage), "accepted");
  assert.equal(readBehaviorChoice(storage, Date.now() + 181 * 86400000), "unknown");
  for (const value of ["bad", '{"choice":"accepted","savedAt":9999999999999}', '{"choice":"unknown","savedAt":0}']) {
    values.set(behaviorConsentKey, value); assert.equal(readBehaviorChoice(storage), "unknown");
  }
  assert.equal(readBehaviorChoice({ getItem() { throw Error("blocked"); } }), "unknown");
  assert.doesNotThrow(() => saveBehaviorChoice({ setItem() { throw Error("blocked"); } }, "declined"));
});

test("only production Rickson.dev home and Tray qualify; no local, preview or case collection", async () => {
  for (const [url, production] of [["http://localhost:3000/tray", true], ["https://rickson-preview.vercel.app/", true], ["https://rickson.dev.evil.test/tray", true], ["https://rickson.dev/cases/silver3", true], ["https://rickson.dev/tray", false]]) {
    const env = environment(url); assert.equal(eligiblePage(env.win.location, production), false);
    await create(env, production).enable(); assert.equal(env.calls.length, 0);
  }
  const env = environment(); create(env); assert.equal(env.calls.length, 0);
});

test("one initialization and one pageview per pathname, ignoring hash/query changes", async () => {
  const env = environment(); const controller = create(env);
  await Promise.all([controller.enable(), controller.enable()]);
  env.win.location = new URL("https://rickson.dev/tray?text=private#faq"); controller.navigate();
  await controller.enable();
  assert.equal(env.calls.filter(call => call[0] === "init").length, 1);
  assert.equal(env.calls.filter(call => call[0] === "$pageview").length, 1);
  env.win.location = new URL("https://rickson.dev/"); await controller.enable();
  assert.deepEqual(env.calls.filter(call => call[0] === "$pageview").map(call => call[1].page_path), ["/tray", "/"]);
});

test("revocation stops recording and capture, clears identity and does not restart on click", async () => {
  const env = environment(); const controller = create(env); await controller.enable();
  controller.disable(); const count = env.calls.length;
  env.sdk.capture("whatsapp_click", { cta_position: "tray-hero" });
  controller.navigate();
  assert.equal(env.calls.length, count + 4); // navigate also keeps the SDK opted out
  assert.ok(env.calls.slice(-4).some(call => call[0] === "opt-out"));
  assert.equal(env.config().before_send({ event: "$snapshot", properties: {}, uuid: "x" }), null);
  await controller.enable();
  assert.equal(env.calls.filter(call => call[0] === "init").length, 1);
  assert.ok(env.calls.at(-1)[0] === "$pageview");
  controller.dispose(); assert.equal(env.listeners.size, 0);
});

test("revocation or navigation during SDK download prevents initialization", async () => {
  for (const action of ["revoke", "navigate", "dispose"]) {
    const env = environment(); let resolve;
    const controller = create(env, true, () => new Promise(done => { resolve = done; }));
    const pending = controller.enable();
    if (action === "revoke") controller.disable();
    if (action === "navigate") env.win.location = new URL("https://rickson.dev/cases/silver3");
    if (action === "dispose") controller.dispose();
    resolve(env.sdk); await pending;
    assert.equal(env.calls.length, 0);
  }
});

test("safe native WhatsApp click captures position without stopping replay or preventing navigation", async () => {
  const env = environment(); const controller = create(env); await controller.enable();
  const before = env.calls.length;
  const href = "https://wa.me/552139551042?text=private-message";
  const target = { closest: () => ({ href, getAttribute: () => "tray-hero" }) };
  const event = { type: "click", button: 0, target, preventDefault() { assert.fail("native link must work"); } };
  env.listeners.get("click")(event);
  assert.deepEqual(env.calls.slice(before), [["whatsapp_click", { page_path: "/tray", platform: "tray", cta_position: "tray-hero" }]]);
  env.listeners.get("auxclick")({ ...event, type: "auxclick", button: 2 });
  assert.equal(env.calls.length, before + 1);
  env.listeners.get("auxclick")({ ...event, type: "auxclick", button: 1 });
  assert.equal(env.calls.length, before + 2);
});

test("failed or blocked SDK leaves native contact listeners harmless; absent config never loads", async () => {
  const env = environment(); const controller = create(env, true, async () => { throw Error("blocked"); });
  await assert.doesNotReject(controller.enable());
  assert.doesNotThrow(() => env.listeners.get("click")({ type: "click", button: 0 }));
  const absent = createBehaviorTracking(env.win, env.doc, true, undefined, undefined, () => assert.fail("must not load"));
  await absent.enable(); assert.equal(env.calls.length, 0);
});

test("contact allowlist rejects foreign destinations, pages and forged positions", () => {
  assert.ok(contactProperties("https://wa.me/552139551042?text=hello", "home-floating", "/"));
  for (const [href, position, path] of [["https://wa.me.evil.test/552139551042", "tray-hero", "/tray"], ["https://wa.me/123", "tray-hero", "/tray"], ["javascript:alert(1)", "tray-hero", "/tray"], ["https://wa.me/552139551042", "home-floating", "/tray"], ["https://wa.me/552139551042", "tray-hero", "/"], ["https://wa.me/552139551042", "unknown", "/tray"]]) assert.equal(contactProperties(href, position, path), undefined);
});

test("events remove query/contact/text properties recursively and do not create person profiles", () => {
  const result = sanitizeBehaviorEvent({ uuid: "x", event: "whatsapp_click", $set: { email: "private@example.com" }, properties: {
    cta_position: "tray-hero", $current_url: "https://rickson.dev/tray?text=private#anchor", $referrer: "https://google.com/search?q=private", $elements: [{ href: "https://wa.me/552139551042?text=private" }], nested: { message: "private", phone: "552139551042", link: "https://wa.me/552139551042" }, $set: { name: "Private" }, $session_id: "session", $device_type: "Mobile"
  } });
  assert.equal(result.properties.$current_url, "https://rickson.dev/tray");
  assert.equal(result.properties.$referrer, "https://google.com");
  assert.deepEqual(result.properties.nested, {});
  assert.equal(result.$set, undefined);
  assert.doesNotMatch(JSON.stringify(result), /private|552139551042|wa\.me/i);
  assert.equal(sanitizeBehaviorEvent({ event: "$autocapture", properties: {} }), null);
  assert.equal(safePageUrl("https://rickson.dev/cases/silver3?private=1"), undefined);
});

test("replay masks text, fields, contact attributes, page URLs and blocks network/console", () => {
  const options = behaviorConfig("https://test.invalid", () => true);
  assert.equal(options.session_recording.maskAllInputs, true);
  assert.equal(options.session_recording.maskTextSelector, "*");
  assert.equal(options.enable_recording_console_log, false);
  assert.equal(options.capture_performance, false);
  assert.equal(options.person_profiles, "never");
  assert.equal(options.opt_out_capturing_by_default, true);
  assert.equal(options.autocapture, false);
  assert.equal(options.session_recording.maskCapturedNetworkRequestFn({ name: "secret" }), null);
  assert.deepEqual(options.session_recording.maskNetworkRequestFn({ url: "https://rickson.dev/tray?text=private#secret" }), { url: "https://rickson.dev/tray" });
  assert.equal(maskReplayAttribute("href", "https://wa.me/552139551042?text=private", { tagName: "A" }), "#");
  assert.equal(maskReplayAttribute("aria-label", "secret"), "***");
  assert.equal(maskReplayAttribute("data-message", "secret"), "");
  assert.equal(maskReplayAttribute("class", "button primary"), "button primary");
});
