"use client";

import { useEffect } from "react";
import { conversionDestination, trackTrayContact, trayAdsConversion, type ContactAnalytics } from "./contactTracking";

const adsId = trayAdsConversion.id;
const adsLabel = trayAdsConversion.label;
const destination = conversionDestination(adsId, adsLabel);

export function TrayContactTracking() {
  useEffect(() => {
    const analytics = window as Window & ContactAnalytics;
    const productionHost = window.location.hostname === "rickson.dev" || window.location.hostname === "www.rickson.dev";
    const sendToGoogle = process.env.NODE_ENV === "production" && productionHost && destination;

    if (sendToGoogle && adsId && !document.getElementById("tray-google-ads-tag")) {
      analytics.dataLayer ??= [];
      // Google tag's command queue expects Arguments objects.
      // eslint-disable-next-line prefer-rest-params
      analytics.gtag ??= function () { analytics.dataLayer?.push(arguments); };
      analytics.gtag("js", new Date());
      analytics.gtag("config", adsId);
      const script = document.createElement("script");
      script.id = "tray-google-ads-tag";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
      document.head.appendChild(script);
    }

    function handleContact(event: MouseEvent) {
      if (event.button > 1 || (event.type === "auxclick" && event.button !== 1)) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[data-cta]");
      if (!anchor) return;
      const placement = anchor.getAttribute("data-cta");
      const tracked = trackTrayContact({ href: anchor.href, placement }, analytics, sendToGoogle || undefined);
      if (tracked && process.env.NODE_ENV === "development") console.info("[Tray] whatsapp_click", placement);
    }

    document.addEventListener("click", handleContact);
    document.addEventListener("auxclick", handleContact);
    return () => {
      document.removeEventListener("click", handleContact);
      document.removeEventListener("auxclick", handleContact);
    };
  }, []);

  return null;
}
