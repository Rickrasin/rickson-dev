"use client";

import Script from "next/script";

const runtimeSrc = "/portfolio-runtime.js?v=20261118-lojas-padrao";
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
