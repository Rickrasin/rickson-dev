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
const leaveDuration = 300;
const arrivalDuration = 440;

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
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const direction: Direction = pathname.startsWith("/cases/") ? "back" : "forward";
      const nextState: TransitionState = {
        direction,
        originX: bounds.left + bounds.width / 2,
        originY: bounds.top + bounds.height / 2,
        phase: "leaving"
      };

      transitionRef.current = nextState;
      targetPathRef.current = destination.pathname;
      targetHashRef.current = destination.hash;
      window.dispatchEvent(new Event("portfolio-visuals-pause"));
      document.documentElement.classList.add("is-route-transitioning");
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
      const arriving = { ...transitionRef.current, phase: "arriving" as const };
      transitionRef.current = arriving;
      setTransition(arriving);

      arrivalTimerRef.current = window.setTimeout(() => {
        transitionRef.current = initialState;
        setTransition(initialState);
        document.documentElement.classList.remove("is-route-transitioning");
        window.dispatchEvent(new Event("portfolio-visuals-resume"));
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
    window.dispatchEvent(new Event("portfolio-visuals-resume"));
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
      <div className={styles.grid} />
      <div className={styles.sigilWrap}>
        <svg className={styles.sigil} viewBox="0 0 240 240">
          <g className={styles.homeSigil}>
            <circle cx="120" cy="120" r="84" />
            <circle cx="120" cy="120" r="58" />
            <path d="M120 31 194 74v88l-74 43-74-43V74Z" />
            <path d="m120 58 54 94H66Z" />
            <path d="M66 89h108M66 151h108M120 58v124" />
            <circle className={styles.node} cx="120" cy="58" r="5" />
            <circle className={styles.node} cx="66" cy="151" r="5" />
            <circle className={styles.node} cx="174" cy="151" r="5" />
          </g>
          <g className={styles.caseSigil}>
            <circle cx="120" cy="120" r="96" />
            <path d="m120 34 83 144H37Z" />
            <path d="m120 68 50 87H70Z" />
            <path d="M120 34v172M37 178l166-56M203 178 37 122" />
            <path className={styles.crystal} d="m120 88 25 32-25 39-25-39Z" />
            <path className={styles.crystal} d="m120 88 8 32-8 39-8-39Z" />
            <circle className={styles.node} cx="120" cy="34" r="5" />
            <circle className={styles.node} cx="37" cy="178" r="5" />
            <circle className={styles.node} cx="203" cy="178" r="5" />
            <circle className={styles.node} cx="120" cy="206" r="4" />
          </g>
        </svg>
        <span className={styles.spark} /><span className={styles.spark} />
        <span className={styles.spark} /><span className={styles.spark} />
      </div>
    </div>
  );
}
