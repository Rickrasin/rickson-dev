import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { StoreContact } from "./StoreContact";
import { TrayContactTracking } from "./TrayContactTracking";
import { TrayMotion } from "./TrayMotion";
import { TrayClarity } from "./TrayClarity";
import "./tray-base.css";
import shared from "./shared.module.css";
import styles from "./page.module.css";

const landingFont = localFont({
  src: "../../../public/assets/fonts/ibm-plex-sans-latin-variable.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-landing"
});

const title = "Criação e implantação de loja Tray";
const description = "Criação de loja virtual na Tray com sua marca, catálogo organizado e apoio a pagamento, frete e publicação. Peça seu orçamento direto com o desenvolvedor.";
const whatsappUrl = `https://wa.me/552139551042?text=${encodeURIComponent("Olá, Rick! Vim pela página de implantação Tray e quero um orçamento para a minha loja. Vendo: ")}`;
const cafeAquaUrl = "https://www.aquaeverest.com.br/";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tray" },
  openGraph: { title, description, url: "/tray" },
  twitter: { title, description }
};

const deliverables = [
  { number: "01", icon: "M16 3a2.8 2.8 0 0 1 4 4L7 20l-5 1 1-5z M14 5l4 4", title: "A identidade da sua marca", text: "Cores, logotipo e banners com a identidade da sua marca." },
  { number: "02", icon: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z", title: "Seus produtos organizados", text: "Categorias organizadas e apoio à importação do seu catálogo." },
  { number: "03", icon: "M3 6h18v12H3z M3 10h18 M7 14h3 M14 14h3", title: "Pagamento e frete", text: "Apoio na configuração de Tray Pagamentos e Tray Envios." },
  { number: "04", icon: "M7 19h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6.2 9.5 4.8 4.8 0 0 0 7 19 M9 13l3-3 3 3 M12 10v7", title: "Apoio para publicar", text: "Apoio com domínio, publicação e integração de um marketplace compatível." }
];

const questions = [
  { question: "Quanto custa a implantação?", answer: "O valor depende do tema, das personalizações e das configurações da loja. Você conhece o preço e as entregas antes de contratar. Assinatura da Tray, domínio e outros serviços têm custos próprios." },
  { question: "Em quanto tempo minha loja fica pronta?", answer: "O prazo mínimo é de 30 dias úteis e varia conforme o projeto. A contagem começa com a equipe cadastrada na Tray e os materiais e acessos combinados disponíveis. Aprovações de pagamento, frete e marketplace também entram no cronograma." },
  { question: "Como ficam o visual e o catálogo?", answer: "Personalizo um tema existente ou desenvolvo um tema próprio, conforme o projeto. Organizo as categorias e apoio a importação de até 1.000 produtos pela planilha da Tray, com dados e imagens que você fornece. Os banners seguem a identidade da sua marca." },
  { question: "O que preciso enviar para começar?", answer: "Você envia os materiais da marca, informações da empresa e dados e imagens dos produtos. Eu te ajudo a organizar o catálogo, liberar acessos e preparar os cadastros de pagamento, frete e marketplace. Também ajudo com o registro do domínio e a contratação da plataforma e de hospedagem quando necessária." },
  { question: "O que está incluído depois da publicação?", answer: "Você recebe orientação de uso e pode solicitar correções de problemas da implantação nos 30 dias após a publicação. Novas funcionalidades e personalizações podem ser contratadas à parte." },
  { question: "Já tenho uma loja Tray. Você pode me ajudar?", answer: "Sim. Avalio a loja com você e definimos os ajustes, as entregas e o prazo conforme o que precisa melhorar." },
  { question: "Você também cuida de anúncios e gestão das vendas?", answer: "Sim. Além da implantação, você pode contratar campanhas de anúncios, produção de conteúdo e gestão de pedidos e vendas. Combinamos as entregas, os valores e o acompanhamento conforme a necessidade do negócio." }
];

function WhatsAppIcon() {
  return <svg className={styles.whatsappIcon} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.93 11.93 0 0 0 12.03 0C5.42 0 .04 5.38.04 11.99c0 2.11.55 4.17 1.59 5.99L0 24l6.17-1.62a11.98 11.98 0 0 0 5.85 1.49h.01c6.61 0 11.99-5.38 11.99-11.99 0-3.2-1.25-6.22-3.5-8.4ZM12.03 21.84h-.01a9.95 9.95 0 0 1-5.07-1.39l-.36-.21-3.66.96.98-3.57-.23-.37a9.93 9.93 0 0 1-1.53-5.27c0-5.45 4.43-9.88 9.89-9.88a9.82 9.82 0 0 1 6.98 2.9 9.82 9.82 0 0 1 2.9 6.99c0 5.44-4.44 9.88-9.89 9.88Zm5.42-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.49a9.05 9.05 0 0 1-1.67-2.08c-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.68-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" /></svg>;
}

function ArrowRightIcon() {
  return <svg className={styles.siteArrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

function ContactLink({ location, children }: { location: string; children: string }) {
  return <a className={`button primary button--reveal ${styles.contactCta}`} href={whatsappUrl} target="_blank" rel="noopener noreferrer" data-clarity-mask="true" data-cta={`tray-${location}`}><span>{children}</span><WhatsAppIcon /></a>;
}

function CafeAquaPreview() {
  return <figure className={styles.casePreview}>
    <a className={styles.caseScreens} href={cafeAquaUrl} target="_blank" rel="noopener noreferrer" aria-label="Explorar a loja Café Aqua em outra aba">
      <span className={styles.caseDesktop}>
        <span className={styles.caseBrowserBar} aria-hidden="true"><span />aquaeverest.com.br</span>
        <Image src="/assets/lojas-virtuais/cafe-aqua-desktop-catalog.jpg" alt="Catálogo da Café Aqua no computador, com purificadores Everest, preços e opções de cor." width={1440} height={796} sizes="(max-width: 600px) 80vw, 550px" />
      </span>
      <span className={styles.caseMobile}>
        <Image src="/assets/lojas-virtuais/cafe-aqua-mobile-clean.jpg" alt="A mesma loja no celular, com navegação compacta e conteúdo adaptado à tela." width={390} height={766} sizes="(max-width: 600px) 27vw, 146px" />
      </span>
    </a>
  </figure>;
}

export default function TrayLandingPage() {
  return (
    <div className={`tray-scope ${landingFont.variable} ${shared.page} ${styles.page}`}>
      <a className={shared.skipLink} href="#conteudo-tray">Ir para o conteúdo</a>
      <header className={shared.header}>
        <div className={`${shared.headerInner} ${styles.headerInner}`}>
          <Link className={`${shared.brand} ${styles.headerBrand}`} href="/" prefetch={false} target="_blank" rel="noopener noreferrer" aria-label="Rickson.dev — visitar meu site em nova aba"><Image src="/assets/brand/logo-horizontal.svg" alt="Rickson.dev" width={1239} height={225} sizes="(max-width: 360px) 110px, (max-width: 600px) 140px, 200px" preload /></Link>
          <a className={`button secondary button--header ${styles.headerCta}`} href={whatsappUrl} target="_blank" rel="noopener noreferrer" data-clarity-mask="true" data-cta="tray-header"><span>Falar no WhatsApp</span><WhatsAppIcon /></a>
        </div>
      </header>

      <main className={shared.main} id="conteudo-tray">
        <section className={styles.hero} aria-labelledby="titulo-tray">
          <div className={styles.heroCopy}>
            <div className={styles.platformLabel}><Image src="/assets/lojas-virtuais/tray-logo.svg" alt="Tray" width={84} height={43} /></div>
            <h1 id="titulo-tray">Sua loja na Tray,<br /><em>pronta para vender.</em></h1>
            <p className={styles.lead}>Desenvolvo sua loja na Tray com a sua marca, catálogo organizado e apoio a pagamento e frete. Você conversa direto comigo até a publicação.</p>
            <div className={styles.heroContact}>
              <ContactLink location="hero">Pedir orçamento pelo WhatsApp</ContactLink>
            </div>
          </div>
          <div className={styles.heroVisual}><Image src="/assets/lojas-virtuais/tray-store-hero-v2.png" alt="Ilustração de uma loja virtual com produtos, exibida em computador e celular." width={1254} height={1254} sizes="(max-width: 360px) 220px, (max-width: 600px) 240px, (max-width: 820px) 420px, 520px" loading="eager" fetchPriority="high" /></div>
        </section>

        <section className={styles.caseStudy} id="projeto-cafe-aqua" aria-labelledby="titulo-cafe-aqua">
          <div className={styles.caseHeading}><p className={`${shared.eyebrow} ${styles.eyebrow}`}>UM PROJETO MEU NA TRAY</p><h2 id="titulo-cafe-aqua">Café Aqua.</h2><p>Uma vitrine própria para purificadores, refis e acessórios.</p></div>
          <div className={styles.caseVisual}><CafeAquaPreview /></div>
          <div className={styles.caseDetails}>
            <p>Criei o layout, organizei o catálogo e adaptei a navegação para computador e celular.</p>
            <ul className={styles.caseContributions}>
              <li><h3>Identidade da marca</h3><p>Cores e tipografia próprias.</p></li>
              <li><h3>Catálogo de produtos</h3><p>Categorias e variações de cor.</p></li>
              <li><h3>Experiência no celular</h3><p>Navegação adaptada à tela.</p></li>
            </ul>
            <a className={`button secondary ${styles.caseVisit}`} href={cafeAquaUrl} target="_blank" rel="noopener noreferrer">Explorar a loja<ArrowRightIcon /></a>
          </div>
        </section>

        <section className={styles.deliveries} id="entregas" aria-labelledby="titulo-entregas">
          <div className={styles.deliveryLayout}>
            <div className={styles.deliveryOffer}>
              <div className={`${shared.sectionHeading} ${styles.deliveryIntro}`}>
                <div><p className={`${shared.eyebrow} ${styles.eyebrow}`}>01 / O QUE VOCÊ RECEBE</p><h2 id="titulo-entregas">Implantação da sua <em>loja na Tray.</em></h2></div>
                <p className={styles.proposalNote}>Tema personalizado ou desenvolvimento de um tema próprio, conforme o seu projeto.</p>
              </div>
              <ul className={styles.deliveryList} role="list">{deliverables.map(item => <li key={item.number}><span className={styles.deliveryIcon}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg></span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ul>
              <div className={styles.deliveryAction} id="orcamento-tray"><h3>Vamos planejar sua loja?</h3><ContactLink location="scope">Pedir orçamento pelo WhatsApp</ContactLink></div>
            </div>
            <div className={styles.scopeOverview} id="acompanhamento-tray">
              <div className={styles.scopeItem}>
                <span className={styles.scopeIcon}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h10l3 3v15H4V3z M16 3v4h4 M8 11h8 M8 15h8 M8 18h5" /></svg></span>
                <div><p className={`${shared.eyebrow} ${styles.eyebrow}`}>PROPOSTA CLARA</p><h3><span className={styles.fullCopy}>Valor e entregas definidos.</span><span className={styles.mobileCopy}>Proposta clara.</span></h3><p><span className={styles.fullCopy}>Você conhece o valor e as entregas antes de contratar.</span><span className={styles.mobileCopy}>Valor e entregas definidos antes de contratar.</span></p></div>
              </div>
              <div className={styles.scopeItem}>
                <span className={styles.scopeIcon}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>
                <div><p className={`${shared.eyebrow} ${styles.eyebrow}`}>PRAZO DE IMPLANTAÇÃO</p><h3>Mínimo de 30 dias úteis.</h3><p><span className={styles.fullCopy}>Contados após o cadastro da equipe na Tray e o recebimento dos materiais e acessos combinados.</span><span className={styles.mobileCopy}>Após o cadastro da equipe na Tray e o recebimento dos materiais e acessos.</span></p></div>
              </div>
              <div className={styles.scopeItem}>
                <span className={styles.scopeIcon}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v-3a9 9 0 0 1 18 0v3 M3 12h3v7H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2 M21 12h-3v7h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2 M18 19v1a2 2 0 0 1-2 2h-3" /></svg></span>
                <div><p className={`${shared.eyebrow} ${styles.eyebrow}`}>DEPOIS DA PUBLICAÇÃO</p><h3><span className={styles.fullCopy}>Orientação para usar sua loja.</span><span className={styles.mobileCopy}>Orientação de uso.</span></h3><p><span className={styles.fullCopy}>Você recebe orientação de uso e pode solicitar correções da implantação nos 30 dias após a publicação.</span><span className={styles.mobileCopy}>Você pode solicitar correções da implantação nos 30 dias após a publicação.</span></p></div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.personalLine} id="sobre-rickson">
          <div className={styles.personalIdentity}>
            <div className={styles.portrait}><Image src="/assets/rickson-about.webp" alt="Rickson de Oliveira" width={96} height={112} sizes="(max-width: 360px) 64px, (max-width: 600px) 80px, 96px" /></div>
            <div className={styles.personalIntro}><span className={styles.personalEyebrow}>DIRETO COM O DESENVOLVEDOR</span><h2>Eu sou o Rickson.</h2></div>
            <p className={styles.personalDescription}><span className={styles.fullCopy}>Sou desenvolvedor de lojas virtuais e cuido da personalização da sua loja na Tray. Durante o projeto, você conversa diretamente comigo para alinhar as decisões, tirar dúvidas e conferir a entrega.</span><span className={styles.mobileCopy}>Desenvolvo sua loja na Tray. Do alinhamento à entrega, você fala direto comigo.</span></p>
          </div>
          <div className={styles.personalSite}>
            <a className={`button secondary ${styles.caseVisit}`} href="/" target="_blank" rel="noopener noreferrer">Visitar meu site<ArrowRightIcon /></a>
          </div>
        </div>

        <section className={styles.process} id="processo" aria-labelledby="titulo-processo">
          <div className={styles.processHeading}>
            <div>
              <p className={`${shared.eyebrow} ${styles.eyebrow}`}>02 / COMO FUNCIONA</p>
              <h2 id="titulo-processo">Do primeiro contato <em>à loja no ar.</em></h2>
            </div>
            <p>Você acompanha as decisões e fala direto comigo em cada etapa.</p>
          </div>
          <ol className={styles.steps}>
            <li><span aria-hidden="true">01</span><h3>Alinhamos o projeto</h3><p>Definimos as entregas, o valor e os materiais para começar.</p></li>
            <li><span aria-hidden="true">02</span><h3>Eu preparo sua loja</h3><p>Personalizo o tema, organizo o catálogo e acompanho as configurações.</p></li>
            <li><span aria-hidden="true">03</span><h3>Revisamos e publicamos</h3><p>Você confere a loja comigo. Após a publicação, te oriento a usar o painel.</p></li>
          </ol>
        </section>

        <section className={`${shared.faq} ${styles.faq}`} id="duvidas-tray" aria-labelledby="titulo-duvidas"><div className={styles.faqHeading}><div><p className={`${shared.eyebrow} ${styles.eyebrow}`}>03 / DÚVIDAS FREQUENTES</p><h2 id="titulo-duvidas">Antes de dar o próximo passo.</h2></div><p>Confira os detalhes sobre o visual da loja, as entregas e o acompanhamento do projeto.</p></div><div className={`${shared.questions} ${styles.questions}`}>{questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span></summary><p>{item.answer}</p></details>)}</div></section>

        <section className={shared.contact} aria-labelledby="titulo-contato">
          <svg className={styles.contactSigil} viewBox="0 0 220 220" width="220" height="220" aria-hidden="true" focusable="false">
            <defs>
              <path id="tray-contact-contour" d="M0.5 0.5H219.5V219.5H0.5Z" pathLength="100" />
              <linearGradient id="tray-contact-gold" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#936414" />
                <stop offset=".35" stopColor="#ce9225" />
                <stop offset=".62" stopColor="#f5ce6f" />
                <stop offset=".8" stopColor="#ffeca6" />
                <stop offset="1" stopColor="#b98219" />
              </linearGradient>
              <filter id="tray-contact-glow" filterUnits="userSpaceOnUse" x="-16" y="-16" width="252" height="252">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <g fill="#eebb46" fillRule="evenodd">
              <path d="M-48-48H268V268H-48Z M0 0H220V220H0Z" opacity=".019608" />
              <path d="M-22-22H242V242H-22Z M0 0H220V220H0Z" opacity=".031373" />
            </g>
            <use className={styles.contactContour} href="#tray-contact-contour" />
            <use className={`${styles.contactTrace} ${styles.contactGlowHalo}`} href="#tray-contact-contour" stroke="#eebb46" strokeWidth="3" filter="url(#tray-contact-glow)" />
            <use className={`${styles.contactTrace} ${styles.contactGlowTrail}`} href="#tray-contact-contour" stroke="url(#tray-contact-gold)" strokeWidth="1.75" />
            <use className={`${styles.contactTrace} ${styles.contactGlowTip}`} href="#tray-contact-contour" stroke="#fff0b5" strokeWidth="2" />
          </svg>
          <div className={`${shared.contactInner} ${styles.contactInner}`}>
            <div className={styles.contactHeading}>
              <p className={`${shared.eyebrow} ${styles.eyebrow}`}>FALE DIRETO COMIGO</p>
              <h2 id="titulo-contato">Vamos colocar<br />sua loja <em>no ar?</em></h2>
            </div>
            <div className={styles.contactAction}>
              <p>Me conte sobre seu negócio e a loja que você quer criar ou melhorar na Tray. Eu preparo uma proposta com as entregas, o valor e o prazo do projeto.</p>
              <ContactLink location="contact">Pedir orçamento pelo WhatsApp</ContactLink>
            </div>
          </div>
        </section>
      </main>
      <footer className={`${shared.footer} ${styles.footer}`}>
        <div className={styles.footerBrand}>
          <Link className={`${shared.brand} ${styles.footerBrandLink}`} href="/" prefetch={false} target="_blank" rel="noopener noreferrer" aria-label="Rickson.dev — visitar meu site em nova aba"><Image src="/assets/brand/logo-horizontal.svg" alt="" width={1239} height={225} sizes="(max-width: 600px) 180px, 220px" /></Link>
          <p>Criação e implantação de lojas Tray.</p>
        </div>
        <a className={styles.backToTop} href="#conteudo-tray">Voltar ao topo<span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V4m-6 6 6-6 6 6" /></svg></span></a>
      </footer>
      <TrayClarity />
      <StoreContact href={whatsappUrl}><WhatsAppIcon /></StoreContact>
      <TrayContactTracking />
      <TrayMotion />
    </div>
  );
}
