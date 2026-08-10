"use client";

import Script from "next/script";

const runtimeSrc = "/portfolio-runtime.js?v=20260810-route-transmutation-11";
const runtimeMountEvent = "portfolio-runtime-mount";

export function PortfolioRuntime() {
  return (
    <Script
      data-portfolio-runtime="true"
      onReady={() => {
        window.dispatchEvent(new Event(runtimeMountEvent));
      }}
      src={runtimeSrc}
      strategy="lazyOnload"
      type="module"
    />
  );
}
