import Image from "next/image";
import styles from "./BrandLogo.module.css";

export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <span aria-hidden="true" className={styles.logo}>
      <Image
        alt=""
        className={styles.light}
        height={225}
        priority={priority}
        sizes="(max-width: 1000px) 180px, (max-width: 1333px) 18vw, 240px"
        src="/assets/brand/logo-horizontal.svg"
        width={1239}
      />
      <Image
        alt=""
        className={styles.dark}
        height={225}
        priority={priority}
        sizes="(max-width: 1000px) 180px, (max-width: 1333px) 18vw, 240px"
        src="/assets/brand/logo-horizontal-branca.svg"
        width={1239}
      />
    </span>
  );
}
