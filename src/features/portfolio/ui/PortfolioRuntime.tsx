"use client";

import Script from "next/script";

export function PortfolioRuntime() {
  return (
    <Script
      src="/portfolio-runtime.js?v=20260714-abstract-sigil"
      strategy="afterInteractive"
      type="module"
    />
  );
}
