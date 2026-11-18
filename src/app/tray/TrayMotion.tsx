"use client";

import { useEffect } from "react";

export function TrayMotion() {
  useEffect(() => {
    const preview = document.querySelector<HTMLElement>("#projeto-cafe-aqua figure");
    const screens = preview?.querySelector<HTMLAnchorElement>("a");
    const contact = document.querySelector<HTMLElement>('section[aria-labelledby="titulo-contato"]');
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopPointer = window.matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)");
    const disclosures = Array.from(document.querySelectorAll<HTMLDetailsElement>("#duvidas-tray details")).flatMap(details => {
      const summary = details.querySelector("summary");
      const answer = details.querySelector("p");
      if (!summary || !answer || typeof details.animate !== "function") return [];

      let expanded = details.open;
      let heightMotion: Animation | undefined;
      let answerMotion: Animation | undefined;

      function finish() {
        if (!heightMotion) return;
        details.open = expanded;
        heightMotion.cancel();
        answerMotion?.cancel();
        heightMotion = undefined;
        answerMotion = undefined;
        details.style.removeProperty("overflow");
        details.removeAttribute("data-closing");
      }

      function toggle(event: MouseEvent) {
        if (reducedMotion.matches || !summary || !answer) return;
        event.preventDefault();

        // Measure the current frame before reversing an unfinished interaction.
        const fromHeight = details.getBoundingClientRect().height;
        const answerStyle = window.getComputedStyle(answer);
        const fromOpacity = details.open ? answerStyle.opacity : "0";
        const fromTransform = details.open ? answerStyle.transform : "translateY(-4px)";
        expanded = heightMotion ? !expanded : !details.open;
        heightMotion?.cancel();
        answerMotion?.cancel();

        details.open = expanded;
        const toHeight = details.getBoundingClientRect().height;
        // Keep the answer rendered until the closing animation has finished.
        details.open = true;
        details.toggleAttribute("data-closing", !expanded);
        details.style.overflow = "hidden";

        const timing = { duration: expanded ? 300 : 220, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "both" as const };
        const animation = details.animate({ height: [`${fromHeight}px`, `${toHeight}px`] }, timing);
        heightMotion = animation;
        answerMotion = answer.animate({
          opacity: [fromOpacity, expanded ? "1" : "0"],
          transform: [fromTransform, expanded ? "translateY(0)" : "translateY(-4px)"]
        }, timing);
        animation.onfinish = () => {
          if (heightMotion === animation) finish();
        };
      }

      summary.addEventListener("click", toggle);
      return [{ finish, destroy() { finish(); summary.removeEventListener("click", toggle); } }];
    });
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let contactVisible = false;

    function resetDepth() {
      if (!frame && !preview?.hasAttribute("data-depth-active")) return;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      preview?.removeAttribute("data-depth-active");
      screens?.style.removeProperty("--case-rotate-x");
      screens?.style.removeProperty("--case-rotate-y");
    }

    function movePreview(event: PointerEvent) {
      if (event.pointerType !== "mouse" || reducedMotion.matches || !desktopPointer.matches || !preview || !screens) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!preview || !screens) return;
        const bounds = preview.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const x = Math.max(-1, Math.min(1, (pointerX - bounds.left) / bounds.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (pointerY - bounds.top) / bounds.height * 2 - 1));
        preview.setAttribute("data-depth-active", "true");
        screens.style.setProperty("--case-rotate-x", `${(-y * 2.5).toFixed(2)}deg`);
        screens.style.setProperty("--case-rotate-y", `${(x * 3.5).toFixed(2)}deg`);
      });
    }

    function syncContact() {
      contact?.setAttribute("data-motion-active", String(contactVisible && !document.hidden && !reducedMotion.matches));
    }

    function syncMotion() {
      finishDisclosures();
      resetDepth();
      syncContact();
    }

    function finishDisclosures() {
      disclosures.forEach(disclosure => disclosure.finish());
    }

    const observer = contact && "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          contactVisible = entry.isIntersecting;
          syncContact();
        }, { threshold: 0.1 })
      : null;

    if (contact) observer?.observe(contact);
    preview?.addEventListener("pointermove", movePreview, { passive: true });
    preview?.addEventListener("pointerleave", resetDepth);
    preview?.addEventListener("pointercancel", resetDepth);
    window.addEventListener("scroll", resetDepth, { passive: true });
    window.addEventListener("blur", resetDepth);
    window.addEventListener("resize", finishDisclosures, { passive: true });
    document.addEventListener("visibilitychange", syncMotion);
    reducedMotion.addEventListener("change", syncMotion);
    desktopPointer.addEventListener("change", resetDepth);

    return () => {
      resetDepth();
      disclosures.forEach(disclosure => disclosure.destroy());
      observer?.disconnect();
      contact?.removeAttribute("data-motion-active");
      preview?.removeEventListener("pointermove", movePreview);
      preview?.removeEventListener("pointerleave", resetDepth);
      preview?.removeEventListener("pointercancel", resetDepth);
      window.removeEventListener("scroll", resetDepth);
      window.removeEventListener("blur", resetDepth);
      window.removeEventListener("resize", finishDisclosures);
      document.removeEventListener("visibilitychange", syncMotion);
      reducedMotion.removeEventListener("change", syncMotion);
      desktopPointer.removeEventListener("change", resetDepth);
    };
  }, []);

  return null;
}
