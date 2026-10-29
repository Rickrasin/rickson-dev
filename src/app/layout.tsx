import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { MagicRouteTransition } from "@/features/portfolio/ui/MagicRouteTransition";
import { SITE } from "@/shared/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author, url: SITE.url }],
  creator: SITE.author,
  publisher: SITE.name,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description
  },
  robots:
    process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
      ? {
          index: false,
          follow: false,
          nocache: true
        }
      : {
          index: true,
          follow: true
        },
  icons: {
    icon: [
      { url: "/assets/favicon.ico", sizes: "any" },
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" }
    ],
    shortcut: "/assets/favicon.ico"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020202" },
    { media: "(prefers-color-scheme: light)", color: "#f9faf6" }
  ]
};

const preferenceScript = `
  try {
    var theme = localStorage.getItem("rickson-portfolio-theme");
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.dataset.theme = theme;
  } catch {}

  try {
    var navigation = performance.getEntriesByType("navigation")[0];
    var isCaseIntro = location.pathname === "/cases/silver3";
    var introKey = isCaseIntro ? "caseIntro" : "homeIntro";
    if ((location.pathname === "/" || isCaseIntro) &&
        (!location.hash || location.hash === (isCaseIntro ? "#case-intro" : "#hero")) &&
        navigation?.type !== "back_forward" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.dataset[introKey] = "true";
      document.documentElement.dataset[introKey + "StartedAt"] = String(performance.now());
      window.setTimeout(function () {
        delete document.documentElement.dataset[introKey];
        delete document.documentElement.dataset[introKey + "StartedAt"];
      }, 2800);
    }
  } catch {}
`;

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html data-theme="dark" lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: preferenceScript }}
          suppressHydrationWarning
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <MagicRouteTransition />
      </body>
    </html>
  );
}
