import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

const trackingSource = readFileSync(new URL("../src/app/tray/contactTracking.ts", import.meta.url), "utf8");
const { outputText } = transpileModule(trackingSource, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ES2022 } });
const { conversionDestination, trackTrayContact } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const contact = { href: "https://wa.me/552139551042?text=nome%20e%20mensagem%20privada", placement: "tray-hero" };

test("WhatsApp click records its placement and sends one zero-revenue conversion", () => {
  const calls = [];
  const analytics = { gtag: (...args) => calls.push(args) };
  assert.equal(trackTrayContact(contact, analytics, "AW-123456789/Tray_Click"), true);
  assert.deepEqual(analytics.dataLayer, [{ event: "whatsapp_click", platform: "tray", page_path: "/tray", cta_position: "tray-hero" }]);
  assert.deepEqual(calls, [["event", "conversion", { send_to: "AW-123456789/Tray_Click", value: 0, currency: "BRL", event_category: "contact", event_label: "tray-hero" }]]);
  assert.equal(JSON.stringify([analytics.dataLayer, calls]).includes("mensagem"), false);
});

test("unrelated links, phone numbers, hosts and placements are not contacts", () => {
  for (const invalid of [
    { ...contact, href: "https://wa.me.evil.test/552139551042" },
    { ...contact, href: "https://wa.me/5511999999999" },
    { ...contact, href: "javascript:alert(1)" },
    { ...contact, href: "not a URL" },
    { ...contact, placement: "other-page" },
    { ...contact, placement: null }
  ]) {
    const analytics = {};
    assert.equal(trackTrayContact(invalid, analytics, "AW-123456789/Tray_Click"), false);
    assert.equal(analytics.dataLayer, undefined);
  }
});

test("contact remains measurable locally without loading a Google SDK", () => {
  const analytics = {};
  assert.doesNotThrow(() => trackTrayContact({ ...contact, placement: "stores-mobile" }, analytics));
  assert.equal(analytics.dataLayer[0].cta_position, "stores-mobile");
});

test("a failed analytics service never throws into the contact click", () => {
  const analytics = { dataLayer: Object.freeze([]), gtag() { throw new Error("blocked"); } };
  assert.doesNotThrow(() => trackTrayContact(contact, analytics, "AW-123456789/Tray_Click"));
});

test("invalid conversion configuration cannot create a Google destination", () => {
  assert.equal(conversionDestination("AW-123456789", "Tray_Click"), "AW-123456789/Tray_Click");
  for (const [id, label] of [[undefined, undefined], ["G-123", "click"], ["AW-123", ""], ["AW-123", "a/b"], ["AW-123?x=1", "click"]]) {
    assert.equal(conversionDestination(id, label), undefined);
  }
});
