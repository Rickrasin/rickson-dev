import type { CaptureResult, PostHog, PostHogConfig } from "posthog-js";

// Separate consent: permission for the former provider never opts into PostHog.
export const behaviorConsentKey = "rickson-posthog-consent-v1";
export type BehaviorChoice = "accepted" | "declined" | "unknown";
type StorageAccess = Pick<Storage, "getItem" | "setItem">;
const lifetime = 180 * 24 * 60 * 60 * 1000;
const hosts = new Set(["rickson.dev", "www.rickson.dev"]);
const paths = new Set(["/", "/tray"]);
const positions = new Set(["tray-header", "tray-hero", "tray-scope", "tray-contact", "stores-floating", "stores-mobile", "home-contact", "home-floating", "home-ecommerce"]);

export function readBehaviorChoice(storage: StorageAccess, now = Date.now()): BehaviorChoice {
  try {
    const value = JSON.parse(storage.getItem(behaviorConsentKey) || "null");
    if (["accepted", "declined"].includes(value?.choice) && typeof value.savedAt === "number" &&
      value.savedAt <= now && now - value.savedAt < lifetime) return value.choice;
  } catch { /* No collection without a valid preference. */ }
  return "unknown";
}

export function saveBehaviorChoice(storage: StorageAccess, choice: Exclude<BehaviorChoice, "unknown">) {
  try { storage.setItem(behaviorConsentKey, JSON.stringify({ choice, savedAt: Date.now() })); } catch { /* This visit only. */ }
}

export function eligiblePage(location: Pick<Location, "hostname" | "pathname">, production: boolean) {
  return production && hosts.has(location.hostname) && paths.has(location.pathname);
}

export function safePageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.has(url.hostname) && paths.has(url.pathname)
      ? `${url.origin}${url.pathname}` : undefined;
  } catch { return undefined; }
}

// Fixed positions only; never pass the native destination or prefilled message.
export function contactProperties(href: string, position: string | null, pathname: string) {
  try {
    const url = new URL(href);
    if (url.origin !== "https://wa.me" || url.pathname !== "/552139551042" || !position || !positions.has(position)) return;
    if (!paths.has(pathname) || (pathname === "/") !== position.startsWith("home-")) return;
    return { page_path: pathname, platform: pathname === "/tray" ? "tray" : "portfolio", cta_position: position };
  } catch { /* Unrelated or malformed URL. */ }
}

function sanitized(value: unknown, key = ""): unknown {
  if (/href|text|email|phone|message|query|search|gclid|fbclid|utm_|elements|element_chain|^\$set/i.test(key)) return undefined;
  if (typeof value === "string") {
    if (/url|referrer/i.test(key)) {
      if (/referrer/i.test(key)) { try { return new URL(value).origin; } catch { return undefined; } }
      return safePageUrl(value);
    }
    if (/https?:|wa\.me|whatsapp\.com|mailto:|tel:|@|552139551042/i.test(value)) return undefined;
    return value;
  }
  if (Array.isArray(value)) return value.map(item => sanitized(item)).filter(item => item !== undefined);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, sanitized(item, name)]).filter(([, item]) => item !== undefined));
  return value;
}

export function sanitizeBehaviorEvent(event: CaptureResult) {
  // Replay snapshots have their own browser-side text, attribute and URL masking.
  // Rewriting the rrweb stream here would corrupt playback.
  if (event.event === "$snapshot") return event;
  if (!["$pageview", "$pageleave", "$heatmaps_data", "$$heatmap", "$dead_click", "$rageclick", "whatsapp_click"].includes(event.event)) return null;
  return { uuid: event.uuid, event: event.event, timestamp: event.timestamp, properties: sanitized(event.properties) as CaptureResult["properties"] };
}

export function maskReplayAttribute(name: string, value: string, element?: Element) {
  if (name === "href") {
    // Keep stylesheets, but remove every navigation/contact destination from replay.
    if (element?.tagName === "LINK") {
      try { const url = new URL(value, "https://rickson.dev"); if (hosts.has(url.hostname) && url.pathname.endsWith(".css")) return `${url.origin}${url.pathname}`; } catch {}
    }
    return "#";
  }
  if (/^(value|placeholder|title|alt|aria-label|srcdoc|action)$/i.test(name)) return "***";
  if (name.startsWith("data-") && !/^(data-theme|data-reveal|data-visible|data-active|data-state)$/.test(name)) return "";
  return value;
}

export function behaviorConfig(host: string, canCapture: () => boolean): Partial<PostHogConfig> {
  return {
    api_host: host,
    defaults: "2026-08-30",
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: true,
    capture_performance: false,
    capture_exceptions: false,
    capture_dead_clicks: true,
    enable_heatmaps: true,
    enable_recording_console_log: false,
    disable_surveys: true,
    advanced_disable_feature_flags: true,
    person_profiles: "never",
    persistence: "localStorage",
    opt_out_capturing_by_default: true,
    opt_out_capturing_persistence_type: "localStorage",
    ip: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*",
      maskAttributeFn: maskReplayAttribute,
      blockSelector: 'input[type="file"], iframe',
      captureJsonLd: false,
      recordHeaders: false,
      recordBody: false,
      maskCapturedNetworkRequestFn: () => null,
      // Also masks replay metadata's page URL (query strings and fragments omitted).
      maskNetworkRequestFn: data => ({ url: safePageUrl(data.url) || "https://rickson.dev/" })
    },
    before_send: event => canCapture() ? sanitizeBehaviorEvent(event) : null
  };
}

type Sdk = Pick<PostHog, "init" | "capture" | "set_config" | "opt_in_capturing" | "opt_out_capturing" | "stopSessionRecording" | "startSessionRecording" | "reset">;

export function createBehaviorTracking(win: Window, doc: Document, production: boolean, token: string | undefined, host: string | undefined, load: () => Promise<Sdk>) {
  let allowed = false;
  let disposed = false;
  let sdk: Sdk | undefined;
  let loading: Promise<void> | undefined;
  let lastPage: string | undefined;
  const eligible = () => !disposed && allowed && eligiblePage(win.location, production);
  const safely = (action: () => void) => { try { action(); } catch { /* Analytics must never block contact. */ } };

  function pageview() {
    const page = safePageUrl(win.location.href);
    if (!sdk || !eligible() || !page || page === lastPage) return;
    lastPage = page;
    safely(() => sdk?.capture("$pageview", { $current_url: page, page_path: win.location.pathname }));
  }

  function pause() {
    lastPage = undefined;
    if (!sdk) return;
    safely(() => sdk?.stopSessionRecording());
    safely(() => sdk?.set_config({ enable_heatmaps: false, capture_dead_clicks: false }));
    safely(() => sdk?.opt_out_capturing());
    safely(() => sdk?.reset(true));
  }

  async function enable() {
    allowed = true;
    if (!eligible() || !token || !host) return;
    if (!loading) {
      loading = load().then(client => {
        if (!eligible()) return;
        sdk = client;
        client.init(token, behaviorConfig(host, eligible));
      }).catch(() => { sdk = undefined; /* Blocked analytics is optional. */ });
    }
    await loading;
    if (!eligible()) return;
    if (!sdk) { loading = undefined; return; }
    safely(() => {
      sdk?.opt_in_capturing({ captureEventName: false });
      sdk?.set_config({ enable_heatmaps: true, capture_dead_clicks: true });
      sdk?.startSessionRecording();
    });
    pageview();
  }

  function contact(event: MouseEvent) {
    if (!eligible() || !sdk || (event.type === "auxclick" && event.button !== 1)) return;
    const target = event.target as Element | null;
    const anchor = target?.closest?.("a[data-cta]") as HTMLAnchorElement | null;
    if (!anchor) return;
    const properties = contactProperties(anchor.href, anchor.getAttribute("data-cta"), win.location.pathname);
    if (properties) safely(() => sdk?.capture("whatsapp_click", properties));
  }
  doc.addEventListener("click", contact);
  doc.addEventListener("auxclick", contact);
  return {
    enable,
    disable() { allowed = false; pause(); },
    navigate() { if (eligible()) void enable(); else pause(); },
    dispose() {
      disposed = true;
      allowed = false;
      pause();
      doc.removeEventListener("click", contact);
      doc.removeEventListener("auxclick", contact);
    }
  };
}
