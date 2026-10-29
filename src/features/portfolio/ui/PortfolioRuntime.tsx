"use client";

import Script from "next/script";

const runtimeSrc = "/portfolio-runtime.js?v=20261029-home-intro-1";
const runtimeMountEvent = "portfolio-runtime-mount";

export function PortfolioRuntime() {
  return (
    <Script
      data-portfolio-runtime="true"
      onReady={() => {
        window.dispatchEvent(new Event(runtimeMountEvent));
      }}
      src={runtimeSrc}
      strategy="afterInteractive"
      type="module"
    />
  );
}
