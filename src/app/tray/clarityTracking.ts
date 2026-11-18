// Public project ID confirmed in Rickson's Microsoft Clarity account.
export const trayClarityProjectId = "zfq1inr6lv";
export const clarityConsentKey = "rickson-tray-clarity-consent-v1";
const consentLifetime = 180 * 24 * 60 * 60 * 1000;
export type ClarityChoice = "accepted" | "declined" | "unknown";
type StorageAccess = Pick<Storage, "getItem" | "setItem">;
type ClarityCall = ((...args: unknown[]) => void) & { q?: unknown[][] };
type ClarityWindow = Window & { clarity?: ClarityCall };

export function readClarityChoice(storage: StorageAccess, now = Date.now()): ClarityChoice {
  try {
    const value = JSON.parse(storage.getItem(clarityConsentKey) || "null");
    if ((value?.choice === "accepted" || value?.choice === "declined") &&
        typeof value.savedAt === "number" && value.savedAt <= now && now - value.savedAt < consentLifetime) return value.choice;
  } catch { /* Storage is optional; default to no collection. */ }
  return "unknown";
}

export function saveClarityChoice(storage: StorageAccess, choice: Exclude<ClarityChoice, "unknown">) {
  try { storage.setItem(clarityConsentKey, JSON.stringify({ choice, savedAt: Date.now() })); } catch { /* Keep the choice for this visit. */ }
}

export function clarityContactEvent(href: string, placement: string | null) {
  const placements = ["tray-header", "tray-hero", "tray-scope", "tray-contact", "stores-floating", "stores-mobile"];
  try {
    const url = new URL(href);
    if (url.origin === "https://wa.me" && url.pathname === "/552139551042" && placement && placements.includes(placement)) {
      return `whatsapp_click_${placement.replaceAll("-", "_")}`;
    }
  } catch { /* Unrelated link. */ }
}

export function createTrayClarity(win: ClarityWindow, doc: Document, production: boolean) {
  let allowed = false;
  let disposed = false;
  let stopped = Boolean(doc.getElementById("tray-clarity-tag"));
  let failed = false;
  let script = doc.getElementById("tray-clarity-tag") as HTMLScriptElement | null;
  const eligible = () => production && !disposed && win.location.pathname === "/tray" &&
    ["rickson.dev", "www.rickson.dev"].includes(win.location.hostname);
  const call = (...args: unknown[]) => { try { win.clarity?.(...args); } catch { /* Never interrupt navigation. */ } };

  function enable() {
    allowed = true;
    if (!eligible() || failed) return;
    if (script) {
      watchScript(script);
      if (stopped) { call("start"); stopped = false; }
      call("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
      return;
    }
    if (win.clarity) { failed = true; return; }
    // The queue and one async loader follow the official installation snippet.
    win.clarity ??= Object.assign((...args: unknown[]) => { win.clarity?.q?.push(args); }, { q: [] as unknown[][] });
    call("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
    call("set", "landing", "tray");
    script = doc.createElement("script");
    script.id = "tray-clarity-tag";
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://www.clarity.ms/tag/${trayClarityProjectId}`;
    watchScript(script);
    doc.head.appendChild(script);
  }

  function watchScript(element: HTMLScriptElement) {
    element.onload = () => { if (!allowed || !eligible() || stopped) call("stop"); };
    element.onerror = () => { failed = true; call("stop"); };
  }

  function disable() {
    allowed = false;
    if (!script) return;
    call("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
    call("stop");
    stopped = true;
  }

  function beforeContact(event: MouseEvent) {
    if (!allowed || !eligible() || !script || failed) return;
    const target = event.target as Element | null;
    const anchor = target?.closest?.("a[data-cta]") as HTMLAnchorElement | null;
    if (!anchor) return;
    const name = clarityContactEvent(anchor.href, anchor.getAttribute("data-cta"));
    if (!name) return;
    // Stop before the SDK's document click listener can serialize the contact URL.
    // Only a fixed, non-personal event name is sent. The native link and Ads handler continue normally.
    call("event", name);
    call("stop");
    stopped = true;
  }

  function resume() { if (allowed && stopped && doc.visibilityState === "visible") enable(); }
  win.addEventListener("click", beforeContact, true);
  win.addEventListener("auxclick", beforeContact, true);
  win.addEventListener("contextmenu", beforeContact, true);
  win.addEventListener("focus", resume);
  doc.addEventListener("visibilitychange", resume);
  return {
    enable,
    disable,
    dispose() {
      disposed = true;
      allowed = false;
      if (script) { call("stop"); stopped = true; }
      win.removeEventListener("click", beforeContact, true);
      win.removeEventListener("auxclick", beforeContact, true);
      win.removeEventListener("contextmenu", beforeContact, true);
      win.removeEventListener("focus", resume);
      doc.removeEventListener("visibilitychange", resume);
    }
  };
}
