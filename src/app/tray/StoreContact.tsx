import type { ReactNode } from "react";
import styles from "./shared.module.css";

export function StoreContact({ href, children }: { href: string; children: ReactNode }) {
  return <div className={styles.floatingContact}>
    <a className={`portfolio-whatsapp ${styles.desktopContact}`} href={href} target="_blank" rel="noopener noreferrer" data-variant="filled" data-cta="stores-floating" aria-label="Conversar sobre minha loja no WhatsApp"><span className="portfolio-whatsapp__pulse" aria-hidden="true" />{children}<span className={styles.contactHint} aria-hidden="true">Falar no WhatsApp</span></a>
    <div className={styles.mobileContact}><a className="button primary button--reveal" href={href} target="_blank" rel="noopener noreferrer" data-cta="stores-mobile"><span>Conversar sobre minha loja</span>{children}</a></div>
  </div>;
}
