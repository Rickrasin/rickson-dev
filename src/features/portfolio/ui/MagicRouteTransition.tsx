"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./MagicRouteTransition.module.css";

type Phase = "idle" | "leaving" | "arriving";
type Direction = "forward" | "back";

type TransitionState = {
  direction: Direction;
  originX: number;
  originY: number;
  phase: Phase;
};

type TransitionStyle = CSSProperties & {
  "--route-origin-x": string;
  "--route-origin-y": string;
};

const initialState: TransitionState = {
  direction: "forward",
  originX: 50,
  originY: 50,
  phase: "idle"
};
const leaveDuration = 1550;
const arrivalDuration = 1250;
const routeRuntimes: Record<Direction, string> = {
  forward: "/silver3-case-runtime.js?v=20260810-route-transmutation-11",
  back: "/portfolio-runtime.js?v=20260810-route-transmutation-11"
};

function warmRouteRuntime(direction: Direction) {
  const src = routeRuntimes[direction];
  if (document.querySelector(`script[data-route-runtime-warmup][src="${src}"]`)) return;
  const script = document.createElement("script");
  script.dataset.routeRuntimeWarmup = "true";
  script.src = src;
  script.type = "module";
  document.head.append(script);
}

function announceRouteMotion(phase: Exclude<Phase, "idle">, direction: Direction) {
  const startedAt = performance.now();
  document.documentElement.dataset.routeTransitionPhase = phase;
  document.documentElement.dataset.routeTransitionDirection = direction;
  document.documentElement.dataset.routeTransitionStartedAt = String(startedAt);
  window.dispatchEvent(new CustomEvent("portfolio-route-transition", {
    detail: { direction, phase, startedAt }
  }));
}

function finishRouteMotion() {
  delete document.documentElement.dataset.routeTransitionPhase;
  delete document.documentElement.dataset.routeTransitionDirection;
  delete document.documentElement.dataset.routeTransitionStartedAt;
  window.dispatchEvent(new Event("portfolio-route-transition-end"));
}

export function MagicRouteTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [transition, setTransition] = useState(initialState);
  const transitionRef = useRef(transition);
  const targetPathRef = useRef("");
  const targetHashRef = useRef("");
  const navigationTimerRef = useRef<number | null>(null);
  const arrivalTimerRef = useRef<number | null>(null);

  useEffect(() => {
    transitionRef.current = transition;
  }, [transition]);

  useEffect(() => {
    const prefetchTimer = window.setTimeout(() => {
      router.prefetch("/cases/silver3");
      router.prefetch("/");
    }, 2200);

    return () => window.clearTimeout(prefetchTimer);
  }, [router]);

  useEffect(() => {
    function handleRouteClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        transitionRef.current.phase !== "idle"
      ) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[data-route-transition]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const bounds = anchor.getBoundingClientRect();
      const clickedWithPointer = event.detail > 0;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const direction: Direction = pathname.startsWith("/cases/") ? "back" : "forward";
      const nextState: TransitionState = {
        direction,
        originX: clickedWithPointer ? event.clientX : bounds.left + bounds.width / 2,
        originY: clickedWithPointer ? event.clientY : bounds.top + bounds.height / 2,
        phase: "leaving"
      };

      transitionRef.current = nextState;
      targetPathRef.current = destination.pathname;
      targetHashRef.current = destination.hash;
      document.documentElement.classList.add("is-route-transitioning");
      announceRouteMotion("leaving", direction);
      warmRouteRuntime(direction);
      setTransition(nextState);

      navigationTimerRef.current = window.setTimeout(() => {
        const routerDestination = `${destination.pathname}${destination.search}`;
        router.push(routerDestination, { scroll: false });
      }, reducedMotion ? 30 : leaveDuration);
    }

    document.addEventListener("click", handleRouteClick, true);
    return () => document.removeEventListener("click", handleRouteClick, true);
  }, [pathname, router]);

  useEffect(() => {
    if (
      transitionRef.current.phase !== "leaving" ||
      pathname !== targetPathRef.current
    ) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    const anchorId = decodeURIComponent(targetHashRef.current.replace(/^#/, ""));
    const anchor = anchorId ? document.getElementById(anchorId) : null;
    const targetTop = anchor ? anchor.getBoundingClientRect().top + window.scrollY : 0;
    window.scrollTo(0, targetTop);
    if (targetHashRef.current) {
      const currentUrl = new URL(window.location.href);
      window.history.replaceState(
        window.history.state,
        "",
        `${currentUrl.pathname}${currentUrl.search}${targetHashRef.current}`
      );
    }

    const frame = window.requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      window.scrollTo(0, targetTop);
      const arriving = { ...transitionRef.current, phase: "arriving" as const };
      transitionRef.current = arriving;
      announceRouteMotion("arriving", arriving.direction);
      setTransition(arriving);

      arrivalTimerRef.current = window.setTimeout(() => {
        transitionRef.current = initialState;
        setTransition(initialState);
        document.documentElement.classList.remove("is-route-transitioning");
        finishRouteMotion();
      }, reducedMotion ? 30 : arrivalDuration);
    });

    return () => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => () => {
    if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
    if (arrivalTimerRef.current) window.clearTimeout(arrivalTimerRef.current);
    document.documentElement.classList.remove("is-route-transitioning");
    finishRouteMotion();
  }, []);

  const transitionStyle: TransitionStyle = {
    "--route-origin-x": `${transition.originX}px`,
    "--route-origin-y": `${transition.originY}px`
  };

  return (
    <div
      aria-hidden="true"
      className={styles.routeTransition}
      data-direction={transition.direction}
      data-phase={transition.phase}
      style={transitionStyle}
    >
      <div className={styles.veil} />
      <div className={styles.originGlow} />
      <div className={styles.apexFlash} />
      <div className={styles.vignette} />
    </div>
  );
}
