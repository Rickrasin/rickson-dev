export type ContactAnalytics = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

// Public identifiers from the "Clique no WhatsApp - Tray" action in Google Ads.
export const trayAdsConversion = { id: "AW-10874621888", label: "r4jLCLGQvrodEMCftsEo" };

const placements = new Set(["tray-header", "tray-hero", "tray-scope", "tray-contact", "stores-floating", "stores-mobile"]);

export function conversionDestination(id?: string, label?: string) {
  if (!id || !label || !/^AW-\d+$/.test(id) || !/^[A-Za-z0-9_-]+$/.test(label)) return undefined;
  return `${id}/${label}`;
}

export function trackTrayContact(
  contact: { href: string; placement: string | null },
  analytics: ContactAnalytics,
  destination?: string
) {
  if (!contact.placement || !placements.has(contact.placement)) return false;
  try {
    const url = new URL(contact.href);
    if (url.origin !== "https://wa.me" || url.pathname !== "/552139551042") return false;
  } catch {
    return false;
  }

  const event = {
    event: "whatsapp_click",
    platform: "tray",
    page_path: "/tray",
    cta_position: contact.placement
  };

  try {
    analytics.dataLayer ??= [];
    analytics.dataLayer.push(event);
  } catch {
    // Analytics must never interrupt the native contact link.
  }

  if (destination && /^AW-\d+\/[A-Za-z0-9_-]+$/.test(destination)) {
    try {
      analytics.gtag?.("event", "conversion", {
        send_to: destination,
        value: 0,
        currency: "BRL",
        event_category: "contact",
        event_label: contact.placement
      });
    } catch {
      // The WhatsApp link remains usable if the measurement service fails.
    }
  }
  return true;
}
