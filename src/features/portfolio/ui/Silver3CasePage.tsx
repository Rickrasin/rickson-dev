"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { MouseEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import styles from "./Silver3CasePage.module.css";

type Language = "pt" | "en";
type Theme = "dark" | "light";

const languageEvent = "rickson-portfolio-language-change";
const themeEvent = "rickson-portfolio-theme-change";
const languageGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#$%&*+";
const languageMorphSelector = "[data-s3-i18n]";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;

function smoothstep(min: number, max: number, value: number) {
  const progress = clamp((value - min) / Math.max(max - min, Number.EPSILON));
  return progress * progress * (3 - 2 * progress);
}

function subscribeToLanguage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(languageEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(languageEvent, onStoreChange);
  };
}

function getLanguageSnapshot(): Language {
  return window.localStorage.getItem("rickson-portfolio-lang") === "en" ? "en" : "pt";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(themeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(themeEvent, onStoreChange);
  };
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

const copy = {
  pt: {
    nav: ["Visão geral", "O problema", "A entrega", "Engenharia", "Resultado"],
    back: "Voltar aos projetos",
    languageLabel: "Trocar idioma para inglês",
    themeLabel: "Alternar tema",
    hero: {
      eyebrow: "Projeto para a Silver3",
      title: "Suporte organizado, do primeiro contato ao fechamento.",
      body:
        "Projetei e desenvolvi para a Silver3 uma plataforma de gestão de chamados de TI com ambiente web e aplicativo móvel, criada para organizar todo o fluxo de suporte interno em um só lugar.",
      primary: "Conhecer o projeto",
      secondary: "Falar sobre um sistema",
      scene: "Portal web e aplicativo móvel da solução desenvolvida para a Silver3"
    },
    problem: {
      label: "// 01. O problema",
      title: "De solicitações dispersas a uma operação sob controle.",
      body:
        "Com uma plataforma, a empresa deixa de depender de mensagens e planilhas soltas para organizar o suporte interno. Os chamados entram em uma fila única, cada etapa tem responsáveis e histórico, e solicitantes, técnicos e gestores acompanham o andamento sem depender de atualizações manuais.",
      items: [
        ["Uma fila para toda a operação", "Todos os chamados seguem o mesmo fluxo, organizados por prioridade, SLA, cliente e responsável."],
        ["Responsabilidade com contexto", "Cada chamado mostra quem está atendendo, o que já foi feito e quando a responsabilidade mudou."],
        ["Visibilidade para acompanhar e decidir", "Quem solicita acompanha o andamento do chamado, enquanto a gestão enxerga volume, prazos, SLAs e gargalos da operação."]
      ]
    },
    delivery: {
      label: "// 02. O que eu entreguei",
      title: "Diferentes experiências. Uma única plataforma.",
      body:
        "A solução desenvolvida para a Silver3 reúne um ambiente web e um aplicativo móvel em uma única plataforma. Web e mobile dão acesso ao mesmo fluxo de chamados, mas organizam a navegação e a apresentação das informações de acordo com a tela e o contexto de uso. A API conecta as duas interfaces e unifica identidades, permissões, regras e dados em um só lugar.",
      platforms: [
        {
          code: "WEB",
          title: "Gestão simples no navegador",
          body: "Telas claras e fáceis de usar para solicitantes, técnicos e gestores abrirem, acompanharem e administrarem chamados com eficiência, aproveitando o espaço e a praticidade do navegador."
        },
        {
          code: "MOBILE",
          title: "Chamados em qualquer lugar",
          body: "A mesma operação em um aplicativo para Android e iOS, com abertura, acompanhamento e atendimento de chamados, anexos e notificações em uma experiência adaptada ao celular."
        },
        {
          code: "API",
          title: "Núcleo da plataforma",
          body: "Camada central que conecta web e mobile e unifica identidades, permissões, regras, chamados, mensagens, anexos, SLAs, notificações e histórico em um só lugar."
        }
      ]
    },
    workflow: {
      label: "// 03. A experiência",
      title: "Cada pessoa vê o que precisa. O fluxo continua o mesmo.",
      body:
        "A superfície web dá amplitude para administrar a operação. O aplicativo aproxima o atendimento de quem está em campo. A API mantém os dois lados coerentes.",
      steps: [
        ["01", "Registrar", "O chamado nasce ligado ao cliente, local e solicitantes corretos."],
        ["02", "Priorizar", "Tipo, categoria, prioridade e SLA orientam o próximo passo."],
        ["03", "Atender", "Conversa, notas, anexos e timeline preservam o contexto."],
        ["04", "Acompanhar", "Painéis, busca, alertas e relatórios mostram o estado da operação."]
      ],
      demo: "Capturas demonstrativas com dados exclusivamente fictícios."
    },
    engineering: {
      label: "// 04. Engenharia",
      title: "Decisões para uma operação real.",
      body:
        "A interface é só a parte visível. Estruturei o produto para proteger dados, manter web e mobile coerentes e continuar previsível mesmo quando a conexão oscila ou a responsabilidade por um chamado muda.",
      stackLabel: "Base técnica",
      stack: ["Next.js", "React", "TypeScript", "Fastify", "Prisma", "PostgreSQL", "Flutter", "Riverpod", "REST", "SSE"],
      items: [
        ["Permissões no servidor", "Capabilities por perfil, organização e local determinam o que cada pessoa pode ver e alterar."],
        ["Sessão protegida no portal", "O navegador usa uma camada BFF do Next.js, mantendo credenciais fora do JavaScript da interface."],
        ["Atualização em tempo real", "SSE, reconciliação e polling mantêm chamados e alertas atualizados mesmo com oscilações de rede."],
        ["Reconexão sem duplicidade", "No app, a tela é preservada e mutações são bloqueadas sem rede; o fluxo retoma com segurança ao reconectar."],
        ["Ações sensíveis com contexto", "Transferências e exclusões mostram o impacto antes da confirmação e geram rastreabilidade."]
      ]
    },
    result: {
      label: "// 05. Resultado",
      title: "Uma operação em uso, com evolução contínua.",
      body:
        "A superfície web já opera em produção e a API sustenta o fluxo real de chamados. O aplicativo cobre a operação móvel e segue como candidato a release para homologação e testes fechados, com pendências de distribuição e validação final.",
      stats: [["WEB", "em produção"], ["API", "ativa"], ["APP", "em homologação"]],
      ctaEyebrow: "Tem uma operação que ainda depende de ferramentas espalhadas?",
      ctaTitle: "Posso transformar esse fluxo em um sistema sob medida.",
      cta: "Conversar sobre o projeto"
    },
    footer: "Projeto desenvolvido para a Silver3 · Rickson de Oliveira"
  },
  en: {
    nav: ["Overview", "The problem", "Delivery", "Engineering", "Outcome"],
    back: "Back to projects",
    languageLabel: "Switch language to Portuguese",
    themeLabel: "Toggle theme",
    hero: {
      eyebrow: "Project for Silver3",
      title: "Organized support, from first contact to resolution.",
      body:
        "I designed and developed an IT ticket management platform for Silver3 with a web environment and mobile app, created to organize the entire internal support workflow in one place.",
      primary: "Explore the project",
      secondary: "Discuss a system",
      scene: "Web portal and mobile application developed for Silver3"
    },
    problem: {
      label: "// 01. The problem",
      title: "From scattered requests to an operation under control.",
      body:
        "With a platform, the company no longer depends on messages and scattered spreadsheets to organize internal support. Tickets enter a single queue, each stage has clear ownership and history, and requesters, technicians, and managers can follow progress without relying on manual updates.",
      items: [
        ["One queue for the entire operation", "Every ticket follows the same workflow, organized by priority, SLA, client, and owner."],
        ["Ownership with context", "Each ticket shows who is handling it, what has been done, and when ownership changed."],
        ["Visibility to track and decide", "Requesters track ticket progress while management sees volume, deadlines, SLAs, and operational bottlenecks."]
      ]
    },
    delivery: {
      label: "// 02. What I delivered",
      title: "Different experiences. One platform.",
      body:
        "The solution developed for Silver3 brings together a web environment and a mobile app in a single platform. Web and mobile provide access to the same ticket workflow while organizing navigation and information for each screen and context of use. The API connects both interfaces and unifies identities, permissions, rules, and data in one place.",
      platforms: [
        { code: "WEB", title: "Simple browser management", body: "Clear, easy-to-use screens for requesters, technicians, and managers to open, track, and manage tickets efficiently while taking advantage of the space and convenience of the browser." },
        { code: "MOBILE", title: "Tickets anywhere", body: "The same operation in an Android and iOS app, with ticket creation, tracking and service, attachments, and notifications in an experience adapted to mobile screens." },
        { code: "API", title: "Platform core", body: "The central layer that connects web and mobile and unifies identities, permissions, rules, tickets, messages, attachments, SLAs, notifications, and history in one place." }
      ]
    },
    workflow: {
      label: "// 03. The experience",
      title: "Each person sees what they need. The workflow stays the same.",
      body:
        "The web surface provides room to manage the operation. The app brings service closer to people in the field. The API keeps both sides consistent.",
      steps: [
        ["01", "Register", "The ticket starts connected to the correct client, location, and requesters."],
        ["02", "Prioritize", "Type, category, priority, and SLA guide the next step."],
        ["03", "Work", "Conversation, notes, attachments, and timeline preserve context."],
        ["04", "Track", "Dashboards, search, alerts, and reports expose the state of the operation."]
      ],
      demo: "Demonstration screenshots produced exclusively with fictional data."
    },
    engineering: {
      label: "// 04. Engineering",
      title: "Decisions built for a real operation.",
      body:
        "The interface is only the visible layer. I structured the product to protect data, keep web and mobile consistent, and remain predictable when connections fluctuate or ticket ownership changes.",
      stackLabel: "Technical foundation",
      stack: ["Next.js", "React", "TypeScript", "Fastify", "Prisma", "PostgreSQL", "Flutter", "Riverpod", "REST", "SSE"],
      items: [
        ["Server-side permissions", "Capabilities by role, organization, and location determine what each person can see and change."],
        ["Protected portal session", "The browser uses a Next.js BFF layer, keeping credentials outside interface JavaScript."],
        ["Real-time updates", "SSE, reconciliation, and polling keep tickets and alerts current through network instability."],
        ["Safe reconnection", "The app preserves the screen and blocks mutations offline, then safely resumes after reconnecting."],
        ["Sensitive actions with context", "Transfers and deletions preview their impact before confirmation and remain traceable."]
      ]
    },
    result: {
      label: "// 05. Outcome",
      title: "A live operation under continuous evolution.",
      body:
        "The web surface is already in production and the API supports the real ticket workflow. The app covers mobile operations and remains a release candidate for validation and closed testing, with distribution and final validation work still pending.",
      stats: [["WEB", "in production"], ["API", "active"], ["APP", "in validation"]],
      ctaEyebrow: "Is your operation still spread across disconnected tools?",
      ctaTitle: "I can turn that workflow into a custom system.",
      cta: "Discuss the project"
    },
    footer: "Project developed for Silver3 · Rickson de Oliveira"
  }
} as const;

const galleryImages = [
  { src: "/assets/cases/silver3/silver3-web-ticket-detail-clean-1920x1080.png", width: 1920, height: 1080, kind: "web" },
  { src: "/assets/cases/silver3/silver3-dashboard-safe.png", width: 1600, height: 900, kind: "web" },
  { src: "/assets/cases/silver3/silver3-app-1280x2856.png", width: 1280, height: 2856, kind: "mobile" },
  { src: "/assets/cases/silver3/silver3-mobile-ticket-local.png", width: 1280, height: 2856, kind: "mobile" }
] as const;

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></svg>;
}

function ThemeToggle({ label, onClick, theme }: {
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  theme: Theme;
}) {
  return (
    <button
      aria-checked={theme === "light"}
      aria-label={label}
      className="theme-toggle"
      data-theme={theme}
      onClick={onClick}
      role="switch"
      type="button"
    >
      <span aria-hidden="true" className="theme-toggle__track">
        <span className="theme-toggle__icon theme-toggle__icon--dark">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            <path className="theme-toggle__moon-star" d="M19 2.5v5M16.5 5h5" />
          </svg>
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--light">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.9 4.9 6.3 6.3" />
            <path d="m17.7 17.7 1.4 1.4" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m4.9 19.1 1.4-1.4" />
            <path d="m17.7 6.3 1.4-1.4" />
          </svg>
        </span>
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}

export function Silver3CasePage() {
  const pendingLanguageMorph = useRef<string[] | null>(null);
  const languageMorphToken = useRef(0);
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    (): Language => "pt"
  );
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    (): Theme => "dark"
  );
  const content = copy[language];

  useLayoutEffect(() => {
    const sourceTexts = pendingLanguageMorph.current;
    if (!sourceTexts) return;
    pendingLanguageMorph.current = null;

    const elements = [...document.querySelectorAll<HTMLElement>(languageMorphSelector)];
    const root = document.documentElement;
    const languageToggle = document.querySelector<HTMLElement>(".language-toggle");
    const token = ++languageMorphToken.current;
    const frameIds = new Set<number>();
    const timeoutIds = new Set<number>();
    const unlockers: Array<() => void> = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scheduleFrame = (callback: FrameRequestCallback) => {
      const frameId = window.requestAnimationFrame((now) => {
        frameIds.delete(frameId);
        callback(now);
      });
      frameIds.add(frameId);
    };

    if (reducedMotion) {
      elements.forEach((element) => element.classList.remove("is-text-morphing"));
      root.classList.remove("is-language-morphing");
      languageToggle?.classList.remove("is-scrambling");
      return;
    }

    const morphs = elements.flatMap((element, index) => {
      const sourceText = sourceTexts[index] ?? "";
      const targetText = element.textContent ?? "";
      if (sourceText === targetText) return [];

      const computed = window.getComputedStyle(element);
      const targetRect = element.getBoundingClientRect();
      element.textContent = sourceText;
      const sourceRect = element.getBoundingClientRect();
      const width = Math.ceil(Math.max(sourceRect.width, targetRect.width));
      const height = Math.ceil(Math.max(sourceRect.height, targetRect.height));
      const previousStyles = {
        display: element.style.display,
        width: element.style.width,
        minHeight: element.style.minHeight
      };
      const shouldLockWidth =
        computed.display === "inline" ||
        computed.display === "inline-block" ||
        Boolean(element.closest(".header-cta, .button, .side-rail"));

      if (shouldLockWidth && width > 0) {
        if (computed.display === "inline") element.style.display = "inline-block";
        element.style.width = `${width}px`;
      }
      if (height > 0) element.style.minHeight = `${height}px`;

      unlockers.push(() => {
        element.style.display = previousStyles.display;
        element.style.width = previousStyles.width;
        element.style.minHeight = previousStyles.minHeight;
      });

      return [{ element, index, sourceText, targetText }];
    });

    if (morphs.length === 0) return;

    root.classList.add("is-language-morphing");
    languageToggle?.classList.add("is-scrambling");
    let remainingMorphs = morphs.length;

    const finishMorph = (element: HTMLElement, targetText: string) => {
      element.textContent = targetText;
      element.classList.remove("is-text-morphing");
      remainingMorphs -= 1;
      if (remainingMorphs > 0 || token !== languageMorphToken.current) return;
      root.classList.remove("is-language-morphing");
      languageToggle?.classList.remove("is-scrambling");
    };

    morphs.forEach(({ element, index, sourceText, targetText }) => {
      const originalLength = sourceText.length;
      const targetLength = targetText.length;
      const maxLength = Math.max(originalLength, targetLength, 1);
      const duration = Math.min(1180, 760 + targetLength * 6);
      const delay = element.closest(".side-rail, .topbar") ? index * 14 : Math.min(260, index * 24);
      const startedAt = performance.now() + delay;
      element.classList.add("is-text-morphing");

      const glyphAt = (now: number, characterIndex: number) => {
        const glyphIndex = Math.floor(
          (now * 0.024 + characterIndex * 13 + token * 3 + sourceText.length) % languageGlyphs.length
        );
        return languageGlyphs[glyphIndex];
      };

      const tick = (now: number) => {
        if (token !== languageMorphToken.current) return;
        const progress = clamp((now - startedAt) / duration);
        if (progress <= 0) {
          scheduleFrame(tick);
          return;
        }

        const lengthProgress = smoothstep(0.12, 0.84, progress);
        const visibleLength = Math.max(1, Math.round(lerp(originalLength || targetLength, targetLength, lengthProgress)));
        const band = Math.max(3, Math.round(maxLength * 0.2));
        const wave = progress * (maxLength + band * 1.1);
        const glyphStart = wave - band;
        const glyphEnd = wave;
        const isScrambling = progress > 0.035;

        element.textContent = Array.from({ length: visibleLength }, (_, characterIndex) => {
          const targetCharacter = targetText[characterIndex] || "";
          const originalCharacter = sourceText[characterIndex] || "";
          const spacingCharacter = targetCharacter || originalCharacter;
          const isResolved = progress > 0.98 || characterIndex < glyphStart;
          const isInWave = characterIndex <= glyphEnd;

          if (!isScrambling && originalCharacter) return originalCharacter;
          if (!targetCharacter) {
            if (isResolved) return "";
            return isInWave ? glyphAt(now, characterIndex) : originalCharacter;
          }
          if (/\s/.test(spacingCharacter)) return isResolved ? targetCharacter : " ";
          if (/[.,:;!?()·]/.test(spacingCharacter)) {
            return isResolved ? targetCharacter : glyphAt(now, characterIndex);
          }
          if (isResolved) return targetCharacter;
          return isInWave ? glyphAt(now, characterIndex) : originalCharacter || glyphAt(now, characterIndex);
        }).join("");

        if (progress < 1) {
          scheduleFrame(tick);
          return;
        }

        finishMorph(element, targetText);
      };

      scheduleFrame(tick);
    });

    const unlockTimer = window.setTimeout(() => unlockers.forEach((unlock) => unlock()), 1600);
    timeoutIds.add(unlockTimer);

    return () => {
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      unlockers.forEach((unlock) => unlock());
      morphs.forEach(({ element }) => element.classList.remove("is-text-morphing"));
      root.classList.remove("is-language-morphing");
      languageToggle?.classList.remove("is-scrambling");
    };
  }, [language]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.case = "silver3";
    root.dataset.section = "case-intro";
    root.lang = language === "en" ? "en" : "pt-BR";
    return () => {
      delete root.dataset.case;
      root.classList.remove("is-case-runtime-ready");
    };
  }, [language]);

  function toggleLanguage() {
    const next = language === "pt" ? "en" : "pt";
    pendingLanguageMorph.current = [...document.querySelectorAll<HTMLElement>(languageMorphSelector)]
      .map((element) => element.textContent ?? "");
    window.localStorage.setItem("rickson-portfolio-lang", next);
    window.dispatchEvent(new Event(languageEvent));
  }

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const applyTheme = () => {
      root.dataset.theme = next;
      window.localStorage.setItem("rickson-portfolio-theme", next);
      window.dispatchEvent(new Event(themeEvent));
    };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const toggleBounds = event.currentTarget.getBoundingClientRect();
    const originX = toggleBounds.left + toggleBounds.width / 2;
    const originY = toggleBounds.top + toggleBounds.height / 2;
    const revealRadius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY)
    );
    const clearTransitionProperties = () => {
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
      root.style.removeProperty("--theme-transition-radius");
    };

    root.style.setProperty("--theme-transition-x", `${originX}px`);
    root.style.setProperty("--theme-transition-y", `${originY}px`);
    root.style.setProperty("--theme-transition-radius", `${revealRadius}px`);

    try {
      const transition = document.startViewTransition(applyTheme);
      void transition.finished.finally(clearTransitionProperties);
    } catch {
      clearTransitionProperties();
      applyTheme();
    }
  }

  const sectionIds = ["case-intro", "case-problem", "case-delivery", "case-engineering", "case-result"];

  return (
    <>
      <canvas aria-hidden="true" className={styles.canvas} id="silver3-case-canvas" />

      <aside aria-label={language === "en" ? "Case navigation" : "Navegação do case"} className={`side-rail ${styles.rail}`}>
        <Link aria-label="Rickson Dev" className="rail-brand" href="/#projects">
          <Image alt="" height={535} priority sizes="42px" src="/assets/rickson-logo.svg" width={759} />
        </Link>
        <nav className="rail-nav">
          {sectionIds.map((id, index) => (
            <a className={index === 0 ? "is-active" : undefined} data-case-nav={id} href={`#${id}`} key={id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{content.nav[index]}</strong>
            </a>
          ))}
        </nav>
        <div className="rail-foot">
          <ThemeToggle label={content.themeLabel} onClick={toggleTheme} theme={theme} />
          <div className="language-toggle">
            <button aria-label={content.languageLabel} className="is-active" onClick={toggleLanguage} type="button">
              <span aria-hidden="true" className="language-toggle__text" data-s3-i18n>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </aside>

      <header className={`topbar ${styles.topbar}`}>
        <Link className="wordmark" href="/">Rickson<br />Dev</Link>
        <Link className={`button secondary header-cta magnetic ${styles.backButton}`} data-route-transition href="/#projects">
          <span data-s3-i18n>← {content.back}</span>
        </Link>
      </header>

      <main className={styles.main}>
        <section className={`shell ${styles.hero}`} data-case-section="case-intro" id="case-intro">
          <div className={styles.heroCopy} data-reveal>
            <p className={styles.kicker} data-s3-i18n>{content.hero.eyebrow}</p>
            <h1 data-s3-i18n>{content.hero.title}</h1>
            <p className={styles.heroBody} data-s3-i18n>{content.hero.body}</p>
            <div className={styles.actions}>
              <a className="button primary magnetic" href="#case-problem"><span data-s3-i18n>{content.hero.primary}</span><ArrowIcon /></a>
              <a className="button secondary magnetic" href="mailto:contato@rickson.dev?subject=Projeto de sistema sob medida"><span data-s3-i18n>{content.hero.secondary}</span><ArrowIcon /></a>
            </div>
          </div>

          <div aria-label={content.hero.scene} className={styles.heroMedia} data-reveal>
            <div aria-hidden="true" className={styles.sceneTopline}><small>WEB / APP</small></div>
            <figure className={styles.heroWebFrame}>
              <div aria-hidden="true" className={styles.heroFrameChrome}>
                <span /><span /><span /><small>SILVER3 / SUPPORT</small>
              </div>
              <Image
                alt={language === "en" ? "Ticket management platform developed for Silver3 with fictional data" : "Plataforma de gestão de chamados desenvolvida para a Silver3 com dados fictícios"}
                height={galleryImages[0].height}
                priority
                sizes="(max-width: 760px) 88vw, (max-width: 1120px) 76vw, 38vw"
                src={galleryImages[0].src}
                width={galleryImages[0].width}
              />
            </figure>
            <figure className={styles.heroMobileFrame}>
              <Image
                alt={language === "en" ? "Mobile ticket management app developed for Silver3 with fictional data" : "Aplicativo móvel de gestão de chamados desenvolvido para a Silver3 com dados fictícios"}
                height={galleryImages[2].height}
                sizes="(max-width: 760px) 28vw, (max-width: 1120px) 20vw, 9vw"
                src={galleryImages[2].src}
                width={galleryImages[2].width}
              />
            </figure>
          </div>
        </section>

        <section className={`shell ${styles.problem}`} data-case-section="case-problem" id="case-problem">
          <div className={`section-lead split ${styles.sectionLead}`} data-reveal>
            <div><span data-s3-i18n>{content.problem.label}</span><h2 data-s3-i18n>{content.problem.title}</h2></div>
            <p data-s3-i18n>{content.problem.body}</p>
          </div>
          <div className={styles.problemStrip}>
            {content.problem.items.map(([title, body], index) => (
              <article data-reveal key={title}><span>0{index + 1}</span><h3 data-s3-i18n>{title}</h3><p data-s3-i18n>{body}</p></article>
            ))}
          </div>
        </section>

        <section className={`shell ${styles.delivery}`} data-case-section="case-delivery" id="case-delivery">
          <div className={`section-lead ${styles.sectionLead}`} data-reveal>
            <div><span data-s3-i18n>{content.delivery.label}</span><h2 data-s3-i18n>{content.delivery.title}</h2></div>
            <p data-s3-i18n>{content.delivery.body}</p>
          </div>
          <div className={styles.platformList}>
            {content.delivery.platforms.map((platform) => (
              <article data-reveal key={platform.code}>
                <span>{platform.code}</span>
                <div><h3 data-s3-i18n>{platform.title}</h3></div>
                <p data-s3-i18n>{platform.body}</p>
              </article>
            ))}
          </div>
          <figure className={styles.dashboardPreview} data-reveal>
            <div className={styles.previewChrome}><span /><span /><span /><small>silver3 / support</small></div>
            <Image alt={language === "en" ? "Ticket detail in the platform developed for Silver3 with fictional data" : "Detalhe de chamado na plataforma desenvolvida para a Silver3 com dados fictícios"} height={galleryImages[0].height} sizes="(max-width: 760px) 92vw, 78vw" src={galleryImages[0].src} width={galleryImages[0].width} />
          </figure>
        </section>

        <section className={`shell ${styles.workflow}`} data-case-section="case-workflow" id="case-workflow">
          <div className={`section-lead split ${styles.sectionLead}`} data-reveal>
            <div><span data-s3-i18n>{content.workflow.label}</span><h2 data-s3-i18n>{content.workflow.title}</h2></div>
            <p data-s3-i18n>{content.workflow.body}</p>
          </div>
          <ol className={styles.processLine}>
            {content.workflow.steps.map(([index, title, body]) => (
              <li data-reveal key={index}><span>{index}</span><h3 data-s3-i18n>{title}</h3><p data-s3-i18n>{body}</p></li>
            ))}
          </ol>
          <p className={styles.demoNote} data-s3-i18n>{content.workflow.demo}</p>
          <div className={styles.gallery}>
            {galleryImages.slice(1).map((image, index) => (
              <figure className={image.kind === "mobile" ? styles.mobilePreview : styles.webPreview} data-reveal key={image.src}>
                <Image alt="" height={image.height} sizes={image.kind === "mobile" ? "(max-width: 760px) 68vw, 24vw" : "(max-width: 760px) 92vw, 54vw"} src={image.src} width={image.width} />
                <figcaption>{index === 0 ? "WEB / DASHBOARD" : `APP / 0${index}`}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={`shell ${styles.engineering}`} data-case-section="case-engineering" id="case-engineering">
          <div className={`section-lead ${styles.sectionLead}`} data-reveal>
            <div><span data-s3-i18n>{content.engineering.label}</span><h2 data-s3-i18n>{content.engineering.title}</h2></div>
            <p data-s3-i18n>{content.engineering.body}</p>
          </div>
          <div className={styles.engineeringList}>
            {content.engineering.items.map(([title, body], index) => (
              <article data-reveal key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3 data-s3-i18n>{title}</h3><p data-s3-i18n>{body}</p></article>
            ))}
          </div>
          <div className={styles.stack} data-reveal>
            <span data-s3-i18n>{content.engineering.stackLabel}</span>
            <ul>
              {content.engineering.stack.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section className={`shell ${styles.result}`} data-case-section="case-result" id="case-result">
          <div className={styles.resultGrid} data-reveal>
            <div><span data-s3-i18n>{content.result.label}</span><h2 data-s3-i18n>{content.result.title}</h2><p data-s3-i18n>{content.result.body}</p></div>
            <dl>
              {content.result.stats.map(([value, label]) => <div key={value}><dt>{value}</dt><dd data-s3-i18n>{label}</dd></div>)}
            </dl>
          </div>
          <div className={styles.cta} data-reveal>
            <span data-s3-i18n>{content.result.ctaEyebrow}</span>
            <h2 data-s3-i18n>{content.result.ctaTitle}</h2>
            <a className="button primary magnetic" href="mailto:contato@rickson.dev?subject=Conversa sobre sistema sob medida"><span data-s3-i18n>{content.result.cta}</span><ArrowIcon /></a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}><span data-s3-i18n>{content.footer}</span><Link href="/">rickson.dev</Link></footer>
      <Script
        onReady={() => {
          window.dispatchEvent(new Event("silver3-runtime-mount"));
        }}
        src="/silver3-case-runtime.js?v=20260810-route-transmutation-11"
        strategy="lazyOnload"
        type="module"
      />
    </>
  );
}
