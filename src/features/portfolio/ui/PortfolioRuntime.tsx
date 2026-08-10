"use client";

import { useEffect } from "react";

const runtimeSrc = "/portfolio-runtime.js?v=20260718-runtime-loader-2";
const runtimeMountEvent = "portfolio-runtime-mount";

export function PortfolioRuntime() {
  useEffect(() => {
    const mountFrame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event(runtimeMountEvent));
    });

    return () => {
      window.cancelAnimationFrame(mountFrame);
    };
  }, []);

  return (
    <script
      async
      data-portfolio-runtime="true"
      src={runtimeSrc}
      type="module"
    />
  );
}
