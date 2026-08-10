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
  "--route-turn": string;
};

const initialState: TransitionState = {
  direction: "forward",
  originX: 50,
  originY: 50,
  phase: "idle"
};
const leaveDuration = 1500;
const arrivalDuration = 1350;

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
    "--route-origin-y": `${transition.originY}px`,
    "--route-turn": transition.direction === "forward" ? "1" : "-1"
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
      <div className={styles.depthGlow} />
      <div className={styles.stage}>
        <div className={styles.worldGrid} />
        <div className={styles.orbitalSystem}>
          <div className={`${styles.halo} ${styles.haloOuter}`} />
          <div className={`${styles.halo} ${styles.haloInner}`} />
          <div className={`${styles.orbitRing} ${styles.ringOne}`} />
          <div className={`${styles.orbitRing} ${styles.ringTwo}`} />
          <div className={`${styles.orbitRing} ${styles.ringThree}`} />
          <span className={`${styles.axis} ${styles.axisHorizontal}`} />
          <span className={`${styles.axis} ${styles.axisVertical}`} />

          <div className={styles.coreRig}>
            <div className={styles.homeForm}>
              <div className={styles.homeFormSpin}>
                <span className={`${styles.trianglePlane} ${styles.triangleOuter}`} />
                <span className={`${styles.trianglePlane} ${styles.triangleMiddle}`} />
                <span className={`${styles.trianglePlane} ${styles.triangleInner}`} />
              </div>
            </div>
            <div className={styles.caseForm}>
              <div className={styles.caseFormSpin}>
                <span className={`${styles.diamondPlane} ${styles.diamondFront}`} />
                <span className={`${styles.diamondPlane} ${styles.diamondCross}`} />
                <span className={`${styles.diamondPlane} ${styles.diamondDepth}`} />
                <span className={`${styles.formNode} ${styles.nodeTop}`} />
                <span className={`${styles.formNode} ${styles.nodeRight}`} />
                <span className={`${styles.formNode} ${styles.nodeBottom}`} />
                <span className={`${styles.formNode} ${styles.nodeLeft}`} />
              </div>
            </div>
            <span className={styles.corePoint} />
          </div>

          <span className={`${styles.depthPoint} ${styles.pointA}`} />
          <span className={`${styles.depthPoint} ${styles.pointB}`} />
          <span className={`${styles.depthPoint} ${styles.pointC}`} />
          <span className={`${styles.depthPoint} ${styles.pointD}`} />
          <span className={`${styles.depthPoint} ${styles.pointE}`} />
          <span className={`${styles.depthPoint} ${styles.pointF}`} />

          <span className={`${styles.spark} ${styles.sparkA}`} />
          <span className={`${styles.spark} ${styles.sparkB}`} />
          <span className={`${styles.spark} ${styles.sparkC}`} />
          <span className={`${styles.spark} ${styles.sparkD}`} />
        </div>
      </div>
      <div className={styles.vignette} />
    </div>
  );
}
