"use client";

import { useEffect, useRef, useState } from "react";
import { createTrayClarity, readClarityChoice, saveClarityChoice, type ClarityChoice } from "./clarityTracking";
import styles from "./clarity.module.css";

export function TrayClarity() {
  const [choice, setChoice] = useState<ClarityChoice>("unknown");
  const [ready, setReady] = useState(false);
  const controller = useRef<ReturnType<typeof createTrayClarity> | null>(null);

  useEffect(() => {
    const tracking = createTrayClarity(window, document, process.env.NODE_ENV === "production");
    controller.current = tracking;
    const frame = requestAnimationFrame(() => {
      let stored: ClarityChoice = "unknown";
      try { stored = readClarityChoice(window.localStorage); } catch { /* No consent without storage access. */ }
      setChoice(stored);
      setReady(true);
      if (stored === "accepted") tracking.enable();
    });
    function sync(event: StorageEvent) {
      if (event.key !== "rickson-tray-clarity-consent-v1" && event.key !== null) return;
      let stored: ClarityChoice = "unknown";
      try { stored = readClarityChoice(window.localStorage); } catch {}
      setChoice(stored);
      if (stored === "accepted") tracking.enable(); else tracking.disable();
    }
    window.addEventListener("storage", sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("storage", sync); tracking.dispose(); controller.current = null; };
  }, []);

  function choose(next: "accepted" | "declined") {
    setChoice(next);
    try { saveClarityChoice(window.localStorage, next); } catch {}
    if (next === "accepted") controller.current?.enable(); else controller.current?.disable();
  }

  return <>
    <section className={styles.privacy} id="privacidade-tray" aria-label="Privacidade desta página" data-clarity-mask="true">
      <details>
        <summary>Privacidade e preferências</summary>
        <div className={styles.description}>
          <p>Com sua permissão, uso o Microsoft Clarity para analisar cliques, rolagem e reproduções da navegação apenas nesta landing page. Isso ajuda a identificar dificuldades e melhorar a experiência.</p>
          <p>O conteúdo é mascarado. Não envio suas mensagens do WhatsApp, conteúdo digitado ou dados de contato como eventos de análise. A Microsoft processa dados técnicos de navegação, como informações do dispositivo, navegador e conexão, conforme a <a href="https://privacy.microsoft.com/pt-br/privacystatement" target="_blank" rel="noopener noreferrer">Declaração de Privacidade da Microsoft</a>. <a href="https://learn.microsoft.com/pt-br/clarity/setup-and-installation/clarity-cookies" target="_blank" rel="noopener noreferrer">Saiba mais sobre os cookies do Clarity</a>.</p>
          <p>Esta preferência vale por até 180 dias neste navegador. Você pode recusar ou retirar a permissão a qualquer momento aqui, sem impedir o acesso à página ou o contato pelo WhatsApp.</p>
          <div className={styles.actions}>
            <button type="button" onClick={() => choose("accepted")} disabled={!ready || choice === "accepted"}>Permitir análise</button>
            <button type="button" onClick={() => choose("declined")} disabled={!ready || choice === "declined"}>Não permitir análise</button>
          </div>
          <p role="status">{choice === "accepted" ? "Análise de navegação permitida." : choice === "declined" ? "Análise de navegação desativada." : "A análise de navegação está desativada até você permitir."}</p>
        </div>
      </details>
    </section>
    {ready && choice === "unknown" && <aside className={styles.banner} aria-label="Permissão para análise de navegação" data-clarity-mask="true">
      <p>Posso usar o Microsoft Clarity para entender cliques e rolagem e melhorar esta página?</p>
      <a href="#privacidade-tray" onClick={() => document.querySelector<HTMLDetailsElement>("#privacidade-tray details")?.setAttribute("open", "")}>Privacidade e preferências</a>
      <div className={styles.actions}><button type="button" onClick={() => choose("accepted")}>Permitir</button><button type="button" onClick={() => choose("declined")}>Recusar</button></div>
    </aside>}
  </>;
}
