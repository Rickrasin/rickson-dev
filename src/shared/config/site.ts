const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rickson.dev";

export const SITE = {
  name: "Rickson.dev",
  author: "Rickson de Oliveira",
  title: "Rickson de Oliveira | Desenvolvedor de software",
  description:
    "Sistemas web sob medida por Rickson de Oliveira para organizar operações, centralizar informações e reduzir trabalho manual.",
  url: configuredUrl.replace(/\/+$/, "")
} as const;
