const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rickson.dev";

export const SITE = {
  name: "Rickson.dev",
  author: "Rickson de Oliveira",
  title: "Sistemas web sob medida | Rickson de Oliveira",
  description:
    "Sistemas web sob medida para organizar processos e reduzir trabalho manual, além de lojas virtuais para vender online. Por Rickson de Oliveira.",
  url: configuredUrl.replace(/\/+$/, "")
} as const;
