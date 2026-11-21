"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { behaviorConsentKey, createBehaviorTracking, readBehaviorChoice, saveBehaviorChoice, type BehaviorChoice } from "./behaviorTracking";
import styles from "./behavior.module.css";

export function BehaviorAnalytics() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<BehaviorChoice>("unknown");
  const [ready, setReady] = useState(false);
  const controller = useRef<ReturnType<typeof createBehaviorTracking> | null>(null);

  useEffect(() => {
    const tracking = createBehaviorTracking(window, document,
      process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview",
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, process.env.NEXT_PUBLIC_POSTHOG_HOST,
      async () => (await import("posthog-js")).default);
    controller.current = tracking;
    function sync() {
      let stored: BehaviorChoice = "unknown";
      try { stored = readBehaviorChoice(window.localStorage); } catch {}
      setChoice(stored);
      setReady(true);
      if (stored === "accepted") void tracking.enable(); else tracking.disable();
    }
    const frame = requestAnimationFrame(sync);
    function storage(event: StorageEvent) { if (event.key === behaviorConsentKey || event.key === null) sync(); }
    window.addEventListener("storage", storage);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("storage", storage); tracking.dispose(); controller.current = null; };
  }, []);

  useEffect(() => { controller.current?.navigate(); }, [pathname]);

  function choose(next: "accepted" | "declined") {
    setChoice(next);
    try { saveBehaviorChoice(window.localStorage, next); } catch {}
    if (next === "accepted") void controller.current?.enable(); else controller.current?.disable();
  }

  if (pathname !== "/" && pathname !== "/tray") return null;
  const variant = pathname === "/tray" ? "light" : undefined;
  return <>
    <section className={styles.privacy} data-variant={variant} id="privacidade" aria-label="Privacidade e preferências">
      <details>
        <summary>Privacidade e preferências</summary>
        <div className={styles.description}>
          <p>Com sua permissão, uso o PostHog no meu site e na página Tray para entender cliques, rolagem, tempo de navegação e reproduções de sessões. Isso ajuda a melhorar a experiência.</p>
          <p>Textos e campos são mascarados antes do envio. Os eventos de contato registram apenas a página e a posição do botão, sem o telefone, o destino do link ou a mensagem do WhatsApp. Não gravo conteúdo de rede nem console.</p>
          <p>O PostHog processa dados técnicos do navegador e dispositivo, com IP anonimizado, conforme sua <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>. A preferência vale por até 180 dias neste navegador. Você pode recusar ou retirar a permissão aqui a qualquer momento, sem impedir o acesso ou o contato.</p>
          <div className={styles.actions}>
            <button type="button" onClick={() => choose("accepted")} disabled={!ready || choice === "accepted"}>Permitir análise</button>
            <button type="button" onClick={() => choose("declined")} disabled={!ready || choice === "declined"}>Não permitir análise</button>
          </div>
          <p role="status">{choice === "accepted" ? "Análise de navegação permitida." : choice === "declined" ? "Análise de navegação desativada." : "A análise de navegação está desativada até você permitir."}</p>
        </div>
      </details>
    </section>
    {ready && choice === "unknown" && <aside className={styles.banner} data-variant={variant} aria-label="Permissão para análise de navegação">
      <p>{pathname === "/tray"
        ? "Posso analisar como você usa esta página para melhorá-la? Textos e dados digitados ficam ocultos nas gravações."
        : "Posso usar o PostHog para entender cliques e rolagem e reproduzir a navegação com textos e campos mascarados?"}</p>
      <a href="#privacidade" onClick={() => document.querySelector<HTMLDetailsElement>("#privacidade details")?.setAttribute("open", "")}>Privacidade e preferências</a>
      <div className={styles.actions}><button type="button" onClick={() => choose("accepted")}>Permitir</button><button type="button" onClick={() => choose("declined")}>Recusar</button></div>
    </aside>}
  </>;
}
