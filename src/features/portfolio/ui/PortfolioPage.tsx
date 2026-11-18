import Image from "next/image";
import type { ReactNode } from "react";
import { BrandLogo } from "@/shared/ui/BrandLogo";
import { PortfolioRuntime } from "./PortfolioRuntime";

const whatsappUrl = `https://wa.me/552139551042?text=${encodeURIComponent("Olá, Rick! Vim pelo seu site e gostaria de conversar sobre um projeto.")}`;
const ecommerceWhatsappUrl = `https://wa.me/552139551042?text=${encodeURIComponent("Olá, Rick! Vim pelo seu site e gostaria de conversar sobre uma loja online.")}`;

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
      <symbol id="icon-coffee" viewBox="0 0 24 24">
        <path d="M5 9h11v5.5A4.5 4.5 0 0 1 11.5 19h-2A4.5 4.5 0 0 1 5 14.5V9Z" />
        <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
        <path d="M8 5c0 1 1 1.2 1 2" />
        <path d="M12 4c0 1.2 1 1.4 1 2.5" />
        <path d="M4 21h15" />
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
          src="/assets/rickson-logo.svg?v=2"
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
        <a data-section-target="ecommerce" href="#lojas-virtuais">
          <span>04</span>
          <strong data-i18n="nav.ecommerce">Lojas</strong>
        </a>
        <a data-section-target="about" href="#about">
          <span>05</span>
          <strong data-i18n="nav.about">Sobre</strong>
        </a>
        <a data-section-target="contact" href="#contact">
          <span>06</span>
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
      <a aria-label="Rickson.dev" className="brand-link" href="#hero">
        <BrandLogo priority />
      </a>
      <a className="button secondary header-cta button--header magnetic" href="#contact">
        <span data-i18n="header.cta">Falar sobre projeto</span>
        <SpriteIcon id="icon-arrow" />
      </a>
    </header>
  );
}

function HeroSection() {
  return (
    <section aria-label="Apresentação" className="hero shell" data-section="hero" id="hero">
      <div className="hero-copy">
        <p className="hero-kicker" data-i18n="hero.kicker">
          Rickson de Oliveira · Desenvolvedor de software
        </p>
        <h1 data-i18n="hero.title">Sistemas sob medida.</h1>
        <p data-i18n="hero.body">
          Desenvolvo sistemas web sob medida para organizar processos e reduzir tarefas manuais.
          Também crio lojas virtuais para negócios venderem online.
        </p>
        <div className="hero-actions">
          <a className="button primary button--reveal magnetic" href="#projects">
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

      <a className="scroll-cue" href="#method">
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
    ["system", "services.one.title", "Entendo o desafio", "services.one.body", "Conheço seu cenário, sua rotina e o problema que realmente precisa ser resolvido."],
    ["interface", "services.two.title", "Entendo como tudo funciona", "services.two.body", "Analiso como o trabalho acontece hoje e identifico o que pode funcionar melhor."],
    ["integration", "services.three.title", "Defino o primeiro passo", "services.three.body", "Organizo as prioridades e defino com você o que faz sentido construir primeiro."],
    ["automation", "services.four.title", "Construo a primeira versão", "services.four.body", "Desenvolvo o essencial, conecto as partes principais e entrego algo funcional para você testar."],
    ["delivery", "services.five.title", "Refino e entrego", "services.five.body", "Ajusto a experiência com base no feedback e preparo o sistema para uso no dia a dia."]
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
      <div className="section-lead projects-lead" data-reveal>
        <span data-i18n="cases.label">{"// 03. Projetos"}</span>
        <h2 data-i18n="cases.title">Projetos pensados para funcionar no mundo real.</h2>
        <p data-i18n="cases.body">
          Cada projeto parte de um desafio diferente, mas segue a mesma ideia: entender bem o
          problema e construir algo que faça sentido no dia a dia.
        </p>
      </div>

      <div className="project-showcase">
        <a className="project-primary magnetic" data-reveal data-route-transition href="/cases/silver3">
          <span aria-hidden="true" className="project-primary__field" />
          <div className="project-primary__copy">
            <span className="project-number">01</span>
            <small className="project-client" data-i18n="cases.one.client">
              Projeto para a Silver3
            </small>
            <h3 data-i18n="cases.one.title">Gestão de chamados</h3>
            <p data-i18n="cases.one.body">
              Plataforma de gestão de chamados de TI criada para centralizar solicitações,
              responsáveis, SLAs, histórico e comunicação.
            </p>
            <span className="project-action">
              <span data-i18n="cases.one.cta">Ver estudo de caso</span>
              <SpriteIcon id="icon-arrow" />
            </span>
          </div>
          <div
            aria-label="Prévias da solução web e mobile desenvolvida para a Silver3 com dados fictícios"
            className="project-primary__media"
            role="group"
          >
            <Image
              className="project-primary__web"
              alt="Fila atual de chamados do portal desenvolvido para a Silver3 com dados fictícios"
              height={1080}
              sizes="(max-width: 760px) 82vw, (max-width: 1120px) 70vw, 44vw"
              src="/assets/cases/silver3/silver3-web-queue-light-demo-20261020.png"
              width={1920}
            />
            <Image
              className="project-primary__phone"
              alt="Painel do aplicativo desenvolvido para a Silver3 com dados fictícios"
              height={2400}
              sizes="(max-width: 760px) 24vw, (max-width: 1120px) 20vw, 11vw"
              src="/assets/cases/silver3/silver3-mobile-dashboard-20261020.png"
              width={1080}
            />
          </div>
        </a>

        <div className="project-secondary-grid">
          <a
            className="project-card magnetic"
            data-reveal
            href="https://www.tifuns.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="project-card__media">
              <Image
                alt="Página inicial atual do Tifuns com conteúdo fictício de demonstração"
                height={900}
                sizes="(max-width: 760px) 88vw, 42vw"
                src="/assets/cases/tifuns/tifuns-home.jpg"
                width={1440}
              />
            </div>
            <div className="project-card__copy">
              <div className="project-card__meta-row">
                <span className="project-number">02</span>
              </div>
              <h3 data-i18n="cases.two.title">Tifuns</h3>
              <p data-i18n="cases.two.body">
                Projeto autoral de um portal sobre games, animes e e-sports, criado para explorar
                identidade visual, organização de conteúdo e uma experiência responsiva de leitura.
              </p>
              <span className="project-action">
                <span data-i18n="cases.two.cta">Visitar projeto</span>
                <SpriteIcon id="icon-arrow" />
              </span>
            </div>
          </a>

          <a
            className="project-card magnetic"
            data-reveal
            href="https://www.aquaeverest.com.br/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="project-card__media">
              <Image
                alt="Catálogo da loja Café Aqua com purificadores e acessórios"
                height={796}
                sizes="(max-width: 760px) 88vw, 42vw"
                src="/assets/lojas-virtuais/cafe-aqua-desktop-catalog.jpg"
                width={1440}
              />
            </div>
            <div className="project-card__copy">
              <div className="project-card__meta-row">
                <span className="project-number">03</span>
              </div>
              <h3 data-i18n="cases.three.title">Café Aqua</h3>
              <p data-i18n="cases.three.body">
                Loja virtual de purificadores, refis e acessórios, com layout personalizado,
                catálogo organizado e navegação adaptada para computador e celular.
              </p>
              <span className="project-action">
                <span data-i18n="cases.three.cta">Visitar loja</span>
                <SpriteIcon id="icon-arrow" />
              </span>
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}

function EcommerceSection() {
  const offerings = [
    ["ecommerce.card.brand", "Identidade visual", "ecommerce.list.brand", "Personalização visual alinhada à sua marca."],
    ["ecommerce.card.catalog", "Catálogo", "ecommerce.list.catalog", "Organização do catálogo e das páginas de produtos."],
    ["ecommerce.card.payment", "Pagamento e frete", "ecommerce.list.payment", "Configuração de recursos de pagamento e frete."],
    ["ecommerce.card.devices", "Em qualquer tela", "ecommerce.list.devices", "Uma experiência adaptada para computador e celular."]
  ];

  return (
    <section className="ecommerce shell" data-section="ecommerce" id="lojas-virtuais" aria-labelledby="ecommerce-title">
      <div className="section-lead projects-lead" data-reveal>
        <span data-i18n="ecommerce.label">{"// 04. Lojas online"}</span>
        <h2 id="ecommerce-title" data-i18n="ecommerce.title">Lojas online pensadas para o seu negócio.</h2>
        <p data-i18n="ecommerce.body">Desenvolvo e personalizo lojas online para apresentar seus produtos, facilitar a navegação e ajudar seus clientes a comprar com praticidade.</p>
      </div>
      <div className="method-strip ecommerce-strip">
        {offerings.map(([titleKey, title, bodyKey, body]) => (
          <article data-reveal key={titleKey}>
            <h3 data-i18n={titleKey}>{title}</h3>
            <p data-i18n={bodyKey}>{body}</p>
          </article>
        ))}
      </div>
      <a className="button primary magnetic ecommerce-cta" data-ecommerce-whatsapp data-reveal href={ecommerceWhatsappUrl} target="_blank" rel="noopener noreferrer">
        <span data-i18n="ecommerce.cta">Falar sobre minha loja no WhatsApp</span>
        <SpriteIcon id="icon-arrow" />
      </a>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about shell" data-section="about" id="about">
      <div className="section-lead about-lead" data-reveal>
        <span data-i18n="about.label">{"// 05. Sobre"}</span>
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
          <h2 data-i18n="about.title">Olá, sou o Rickson, desenvolvedor de software.</h2>
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
          <span data-i18n="contact.label">{"// 06. Contato"}</span>
          <h2 data-i18n="contact.title">Vamos tirar sua ideia do papel?</h2>
          <p className="contact-copy" data-i18n="contact.body">
            Se você tem algum projeto em mente, um processo lento ou uma rotina manual, posso te
            ajudar a transformar isso numa solução clara e funcional.
          </p>
        </div>
        <div className="contact-actions booking-actions">
          <a
            className="contact-line contact-line--featured magnetic"
            href="https://cal.com/rickras/30min"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SpriteIcon id="icon-spark" />
            <span>
              <strong data-i18n="contact.schedule">Agendar uma conversa</strong>
              <small data-i18n="contact.schedule.note">
                Escolha um horário de 30 minutos para falarmos sobre seu projeto.
              </small>
            </span>
          </a>
          <a className="contact-line magnetic" href="mailto:contato@rickson.dev">
            <SpriteIcon id="icon-mail" />
            <span data-i18n="contact.email">Falar por e-mail</span>
          </a>
          <a
            className="contact-line magnetic"
            href={whatsappUrl}
            data-whatsapp-contact
            rel="noopener noreferrer"
            target="_blank"
          >
            <SpriteIcon id="icon-arrow" />
            <span data-i18n="contact.whatsapp">Me chame no WhatsApp</span>
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
        <EcommerceSection />
        <AboutSection />
        <ContactSection />
      </main>
      <a className="portfolio-whatsapp" href={whatsappUrl} data-whatsapp-contact target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <span className="portfolio-whatsapp__pulse" aria-hidden="true" />
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.93 11.93 0 0 0 12.03 0C5.42 0 .04 5.38.04 11.99c0 2.11.55 4.17 1.59 5.99L0 24l6.17-1.62a11.98 11.98 0 0 0 5.85 1.49h.01c6.61 0 11.99-5.38 11.99-11.99 0-3.2-1.25-6.22-3.5-8.4ZM12.03 21.84h-.01a9.95 9.95 0 0 1-5.07-1.39l-.36-.21-3.66.96.98-3.57-.23-.37a9.93 9.93 0 0 1-1.53-5.27c0-5.45 4.43-9.88 9.89-9.88a9.82 9.82 0 0 1 6.98 2.9 9.82 9.82 0 0 1 2.9 6.99c0 5.44-4.44 9.88-9.89 9.88Zm5.42-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.49a9.05 9.05 0 0 1-1.67-2.08c-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.68-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" /></svg>
      </a>
      <PortfolioRuntime />
    </>
  );
}
