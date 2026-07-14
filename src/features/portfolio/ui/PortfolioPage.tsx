import Image from "next/image";
import type { ReactNode } from "react";
import { PortfolioRuntime } from "./PortfolioRuntime";

function SpriteIcon({ id }: { id: string }) {
  return (
    <svg aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

function SvgSprite() {
  return (
    <svg aria-hidden="true" className="svg-sprite" focusable="false">
      <symbol id="icon-arrow" viewBox="0 0 24 24">
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </symbol>
      <symbol id="icon-spark" viewBox="0 0 24 24">
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m6.4 6.4 2.8 2.8" />
        <path d="m14.8 14.8 2.8 2.8" />
        <path d="m17.6 6.4-2.8 2.8" />
        <path d="m9.2 14.8-2.8 2.8" />
      </symbol>
      <symbol id="icon-target" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M22 12h-3" />
      </symbol>
      <symbol id="icon-code" viewBox="0 0 24 24">
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m14 5-4 14" />
      </symbol>
      <symbol id="icon-cube" viewBox="0 0 24 24">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M4.5 8 12 12.3 19.5 8" />
        <path d="M12 12.3V21" />
      </symbol>
      <symbol id="icon-loop" viewBox="0 0 24 24">
        <path d="M18 7a7 7 0 0 0-11.8 2" />
        <path d="M18 7V3" />
        <path d="M18 7h-4" />
        <path d="M6 17a7 7 0 0 0 11.8-2" />
        <path d="M6 17v4" />
        <path d="M6 17h4" />
      </symbol>
      <symbol id="icon-mail" viewBox="0 0 24 24">
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </symbol>
    </svg>
  );
}

function ThemeToggle() {
  return (
    <button
      aria-checked="false"
      aria-label="Alternar tema"
      className="theme-toggle"
      id="theme-toggle"
      role="switch"
      type="button"
    >
      <span aria-hidden="true" className="theme-toggle__track">
        <span className="theme-toggle__icon theme-toggle__icon--dark">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M21 14.6A8.4 8.4 0 0 1 9.4 3 7.2 7.2 0 1 0 21 14.6Z" />
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

function LanguageToggle() {
  return (
    <button
      aria-label="Trocar idioma para inglês"
      className="language-toggle is-active"
      data-active-lang="pt"
      data-next-lang="en"
      id="language-toggle"
      type="button"
    >
      <span aria-hidden="true" className="language-toggle__text" data-language-label>
        PT
      </span>
    </button>
  );
}

function SideRail() {
  return (
    <aside aria-label="Navegação principal" className="side-rail">
      <a aria-label="Rickson Dev" className="rail-brand" href="#hero">
        <Image
          alt=""
          height={535}
          priority
          sizes="48px"
          src="/assets/rickson-logo.svg"
          width={759}
        />
      </a>
      <nav className="rail-nav">
        <a className="is-active" data-section-target="hero" href="#hero">
          <span>01</span>
          <strong data-i18n="nav.hero">Início</strong>
        </a>
        <a data-section-target="method" href="#method">
          <span>02</span>
          <strong data-i18n="nav.services">Fluxo</strong>
        </a>
        <a data-section-target="projects" href="#projects">
          <span>03</span>
          <strong data-i18n="nav.cases">Casos</strong>
        </a>
        <a data-section-target="about" href="#about">
          <span>04</span>
          <strong data-i18n="nav.about">Sobre</strong>
        </a>
        <a data-section-target="contact" href="#contact">
          <span>05</span>
          <strong data-i18n="nav.contact">Contato</strong>
        </a>
      </nav>
      <div aria-label="Preferências" className="rail-foot">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <a className="wordmark" href="#hero">
        Rickson
        <br />
        Dev
      </a>
      <a className="button secondary header-cta magnetic" href="#contact">
        <span data-i18n="header.cta">Falar sobre projeto</span>
        <SpriteIcon id="icon-arrow" />
      </a>
    </header>
  );
}

function HeroSection() {
  return (
    <section aria-label="Apresentação" className="hero shell" data-section="hero" id="hero">
      <div className="hero-copy" data-reveal>
        <p className="hero-kicker" data-i18n="hero.kicker">
          Rickson de Oliveira · Desenvolvimento Full Stack
        </p>
        <h1 data-i18n="hero.title">Sistemas web sob medida para organizar sua operação.</h1>
        <p data-i18n="hero.body">
          Desenvolvo soluções que centralizam informações, automatizam tarefas manuais e
          transformam processos confusos em fluxos claros para o seu negócio.
        </p>
        <div className="hero-actions">
          <a className="button primary magnetic" href="#projects">
            <span data-i18n="hero.primary">Ver projetos</span>
            <SpriteIcon id="icon-arrow" />
          </a>
          <a className="button secondary magnetic" href="#contact">
            <span data-i18n="hero.secondary">Conversar sobre um sistema</span>
            <SpriteIcon id="icon-arrow" />
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="sigil-anchor" id="sigil-anchor" />

      <a className="scroll-cue" data-reveal href="#method">
        <span />
        <small data-i18n="hero.scroll">Role para explorar</small>
      </a>
    </section>
  );
}

function ServiceSigil({ variant }: { variant: string }) {
  const shapes: Record<string, ReactNode> = {
    system: (
      <>
        <path className="sigil-orbit sigil-soft" d="M12 35c5-17 26-25 40-13" />
        <path className="sigil-orbit sigil-faint" d="M15 44c10 9 29 5 36-8" />
        <path className="sigil-main" d="M32 8 49 20v24L32 56 15 44V20Z" />
        <path className="sigil-soft" d="M22 32h20M32 18v28" />
        <path className="sigil-accent" d="M23 23 32 18l9 5" />
        <circle className="sigil-node" cx="32" cy="32" r="4" />
        <circle className="sigil-dot" cx="32" cy="10" r="2" />
        <circle className="sigil-dot" cx="51" cy="32" r="2" />
        <circle className="sigil-dot" cx="13" cy="32" r="2" />
      </>
    ),
    interface: (
      <>
        <path className="sigil-orbit sigil-faint" d="M16 19c9-8 28-8 36 4" />
        <path className="sigil-main" d="M14 22h31l5 6v20H19l-5-6Z" />
        <path className="sigil-soft" d="M20 29h24M20 36h17M20 43h22" />
        <path className="sigil-accent" d="M46 22v9h9" />
        <path className="sigil-soft sigil-rune" d="M12 47 7 52M52 13l5-5" />
        <circle className="sigil-node" cx="17" cy="22" r="3" />
        <circle className="sigil-dot" cx="50" cy="48" r="2" />
      </>
    ),
    integration: (
      <>
        <path className="sigil-orbit sigil-faint" d="M13 39c8 14 31 15 40 0" />
        <path className="sigil-main" d="M32 9 50 20v23L32 55 14 43V20Z" />
        <path className="sigil-soft" d="M32 19v13M21 38l11-6 11 6M21 26l11 6 11-6" />
        <circle className="sigil-node" cx="32" cy="19" r="4" />
        <circle className="sigil-node" cx="21" cy="38" r="4" />
        <circle className="sigil-node" cx="43" cy="38" r="4" />
        <path className="sigil-accent" d="M32 43v6" />
        <circle className="sigil-dot" cx="32" cy="51" r="2" />
      </>
    ),
    automation: (
      <>
        <path className="sigil-orbit sigil-soft" d="M47 19a21 21 0 0 0-32 20" />
        <path className="sigil-orbit sigil-soft" d="M17 45a21 21 0 0 0 32-20" />
        <path className="sigil-main" d="M46 13v12H34M18 51V39h12" />
        <path className="sigil-accent" d="M23 24h18M23 32h18M23 40h18" />
        <circle className="sigil-node" cx="32" cy="32" r="5" />
        <circle className="sigil-dot" cx="47" cy="19" r="2" />
        <circle className="sigil-dot" cx="17" cy="45" r="2" />
      </>
    ),
    delivery: (
      <>
        <path className="sigil-orbit sigil-soft" d="M14 32c5-14 22-22 36-12" />
        <path className="sigil-orbit sigil-faint" d="M13 42c12 12 33 8 40-7" />
        <path className="sigil-main" d="M18 34 29 45 48 18" />
        <path className="sigil-soft" d="M20 18h20M20 52h24" />
        <path className="sigil-accent" d="M25 35 30 40 43 25" />
        <circle className="sigil-node" cx="18" cy="34" r="4" />
        <circle className="sigil-node" cx="48" cy="18" r="4" />
        <circle className="sigil-dot" cx="50" cy="36" r="2" />
      </>
    )
  };

  return (
    <span aria-hidden="true" className={`service-sigil service-sigil--${variant}`}>
      <svg className="service-sigil__glyph" focusable="false" viewBox="0 0 64 64">
        {shapes[variant]}
      </svg>
    </span>
  );
}

function WorkflowSection() {
  const steps = [
    ["system", "services.one.title", "Converso com o cliente", "services.one.body", "Antes de pensar em código, entendo o contexto, a rotina e o problema que precisa ser resolvido."],
    ["interface", "services.two.title", "Entendo o fluxo real", "services.two.body", "Organizo etapas, usuários, dados e pontos de dificuldade para enxergar onde o sistema pode ajudar."],
    ["integration", "services.three.title", "Planejo a solução", "services.three.body", "Desenho um caminho simples para validar a solução antes de construir tudo."],
    ["automation", "services.four.title", "Construo uma prévia", "services.four.body", "Desenvolvo o núcleo do sistema, conecto as partes principais e mostro algo real para testar."],
    ["delivery", "services.five.title", "Ajusto e entrego", "services.five.body", "Refino com feedback, melhoro a experiência e preparo o sistema para uso no dia a dia."]
  ];

  return (
    <section className="method shell" data-section="method" id="method">
      <div className="section-lead" data-reveal>
        <span data-i18n="services.label">{"// 02. Fluxo"}</span>
        <h2 data-i18n="services.title">Meu fluxo de trabalho.</h2>
        <p data-i18n="services.body">
          Trabalho em etapas simples: entendo o problema, organizo o fluxo, construo uma primeira
          versão e ajusto com feedback até a solução ficar clara, funcional e pronta para uso.
        </p>
      </div>

      <div className="method-strip">
        {steps.map(([variant, titleKey, title, bodyKey, body]) => (
          <article data-reveal key={titleKey}>
            <ServiceSigil variant={variant} />
            <h3 data-i18n={titleKey}>{title}</h3>
            <p data-i18n={bodyKey}>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="projects shell" data-section="projects" id="projects">
      <div className="section-lead split" data-reveal>
        <div>
          <span data-i18n="cases.label">{"// 03. Casos"}</span>
          <h2 data-i18n="cases.title">Projetos criados para resolver problemas reais.</h2>
          <p data-i18n="cases.body">
            Sistemas, estudos e soluções que mostram minha forma de pensar, organizar processos e
            transformar ideias em algo funcional.
          </p>
        </div>
        <a className="inline-action magnetic" href="#contact">
          <span data-i18n="cases.cta">Conversar sobre um projeto</span>
          <SpriteIcon id="icon-arrow" />
        </a>
      </div>

      <div className="case-list">
        <a className="case-row case-row--featured magnetic" data-reveal href="#contact">
          <span className="case-index">01</span>
          <div>
            <h3 data-i18n="cases.one.title">Silver3</h3>
            <p data-i18n="cases.one.body">
              Plataforma de atendimento criada para organizar chamados de TI, clientes e operações
              em um só fluxo. Além do sistema web, o Silver3 agora possui um aplicativo para Android
              e iOS com painel, chamados, alertas, notificações e suporte a trabalho offline.
            </p>
            <small className="case-platforms" data-i18n="cases.one.meta">
              Plataforma web · Aplicativo Android e iOS
            </small>
          </div>
          <div
            aria-label="Prévias sanitizadas das versões web e mobile do Silver3"
            className="case-media case-media--silver3"
            role="group"
          >
            <Image
              className="case-media__web"
              alt="Painel sanitizado do Silver3"
              height={428}
              sizes="(max-width: 760px) 84vw, (max-width: 1120px) 44vw, 24vw"
              src="/assets/cases/silver3/silver3-dashboard-safe-thumb.png"
              width={760}
            />
            <Image
              className="case-media__phone"
              alt="Painel do aplicativo Silver3 com dados fictícios"
              height={900}
              sizes="(max-width: 760px) 40vw, 8vw"
              src="/assets/cases/silver3/silver3-mobile-dashboard-safe.png"
              width={430}
            />
            <Image
              className="case-media__phone"
              alt="Lista de chamados do aplicativo Silver3 com dados fictícios"
              height={900}
              sizes="(max-width: 760px) 40vw, 8vw"
              src="/assets/cases/silver3/silver3-mobile-tickets-safe.png"
              width={430}
            />
          </div>
          <SpriteIcon id="icon-arrow" />
        </a>

        <a
          className="case-row case-row--featured magnetic"
          data-reveal
          href="https://www.tifuns.com"
          rel="noreferrer"
          target="_blank"
        >
          <span className="case-index">02</span>
          <div>
            <h3 data-i18n="cases.two.title">Tifuns</h3>
            <p data-i18n="cases.two.body">
              Portal editorial sobre games, animes e e-sports, criado para publicar notícias, guias
              e destaques em uma experiência web escura, responsiva e direta de navegar.
            </p>
          </div>
          <div aria-label="Prévia do site Tifuns" className="case-media" role="group">
            <Image
              alt="Página inicial do Tifuns"
              height={900}
              sizes="(max-width: 900px) 84vw, 36vw"
              src="/assets/cases/tifuns/tifuns-home.png"
              width={1440}
            />
            <Image
              alt="Versão mobile do Tifuns"
              height={1688}
              sizes="(max-width: 900px) 84vw, 28vw"
              src="/assets/cases/tifuns/tifuns-mobile.png"
              width={780}
            />
            <Image
              alt="Lista de conteúdos do Tifuns"
              height={900}
              sizes="(max-width: 900px) 84vw, 36vw"
              src="/assets/cases/tifuns/tifuns-section.png"
              width={1440}
            />
          </div>
          <SpriteIcon id="icon-arrow" />
        </a>

        <a className="case-row magnetic" data-reveal href="#contact">
          <span className="case-index">03</span>
          <div>
            <h3 data-i18n="cases.three.title">Rickson.dev</h3>
            <p data-i18n="cases.three.body">
              Meu próprio portfólio também é um projeto: marca pessoal, narrativa, animações, versão
              bilíngue e uma experiência visual criada para apresentar meu trabalho com personalidade,
              sem esconder o conteúdo atrás dos efeitos.
            </p>
          </div>
          <small data-i18n="cases.three.meta">Marca pessoal · front-end · WebGL</small>
          <SpriteIcon id="icon-arrow" />
        </a>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about shell" data-section="about" id="about">
      <div className="section-lead about-lead" data-reveal>
        <span data-i18n="about.label">{"// 04. Sobre"}</span>
      </div>

      <div className="about-grid" data-reveal>
        <figure className="about-photo">
          <Image
            alt="Foto de Rickson de Oliveira"
            height={1402}
            sizes="(max-width: 900px) 86vw, 34vw"
            src="/assets/rickson-about.webp"
            width={1122}
          />
        </figure>
        <div className="about-copy">
          <h2 data-i18n="about.title">Olá, sou o Rickson, desenvolvedor full stack.</h2>
          <p data-i18n="about.body">
            Crio sistemas web sob medida para ajudar empresas e profissionais a organizarem melhor
            seus processos, centralizarem informações e reduzirem tarefas manuais no dia a dia.
          </p>
          <p data-i18n="about.detail">
            Gosto de entender de perto a rotina de cada cliente antes de desenvolver qualquer
            solução. Assim, consigo transformar problemas reais em ferramentas simples, funcionais e
            fáceis de usar.
          </p>
          <p data-i18n="about.close">
            Meu trabalho é transformar rotinas confusas em sistemas que as pessoas realmente
            conseguem usar no dia a dia.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact shell" data-section="contact" id="contact">
      <div className="contact-grid" data-reveal>
        <div>
          <span data-i18n="contact.label">{"// 05. Contato"}</span>
          <h2 data-i18n="contact.title">Vamos tirar sua ideia do papel?</h2>
          <p className="contact-copy" data-i18n="contact.body">
            Se você tem algum projeto em mente, um processo lento ou uma rotina manual, posso te
            ajudar a transformar isso numa solução clara e funcional.
          </p>
        </div>
        <div className="contact-actions booking-actions">
          <a
            className="contact-line contact-line--featured magnetic"
            href="mailto:contato@rickson.dev?subject=Conversa%20sobre%20projeto%20-%20Rickson.dev"
          >
            <SpriteIcon id="icon-spark" />
            <span>
              <strong data-i18n="contact.schedule">Quero organizar um processo</strong>
              <small data-i18n="contact.schedule.note">
                Me conte o que está lento, manual ou espalhado hoje.
              </small>
            </span>
          </a>
          <a className="contact-line magnetic" href="mailto:contato@rickson.dev">
            <SpriteIcon id="icon-mail" />
            <span data-i18n="contact.email">Enviar um contexto por e-mail</span>
          </a>
          <a
            className="contact-line magnetic"
            href="https://www.linkedin.com/in/ricksondev/"
            rel="noreferrer"
            target="_blank"
          >
            <SpriteIcon id="icon-arrow" />
            <span data-i18n="contact.linkedin">Me chamar no LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function PortfolioPage() {
  return (
    <>
      <SvgSprite />
      <canvas aria-hidden="true" id="magic-canvas" />
      <SideRail />
      <Topbar />
      <main>
        <HeroSection />
        <WorkflowSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <PortfolioRuntime />
    </>
  );
}
