import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rickson de Oliveira | Desenvolvimento Full Stack",
    template: "%s | Rickson.dev"
  },
  description:
    "Sistemas web sob medida por Rickson de Oliveira para organizar operações, centralizar informações e reduzir trabalho manual.",
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
  initialScale: 1
};

const preferenceScript = `
  try {
    var theme = localStorage.getItem("rickson-portfolio-theme");
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.dataset.theme = theme;
  } catch {}
`;

export default async function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html data-theme="dark" lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: preferenceScript }}
          nonce={nonce}
          suppressHydrationWarning
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
