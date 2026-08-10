import type { Metadata } from "next";
import { Silver3CasePage } from "@/features/portfolio/ui/Silver3CasePage";

const title = "Silver3 — Plataforma de chamados de TI";
const description =
  "Case do Silver3, plataforma de gerenciamento de chamados de TI com superfície web em produção, core ativo e aplicativo móvel em homologação.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cases/silver3"
  },
  openGraph: {
    title,
    description,
    url: "/cases/silver3"
  },
  twitter: {
    title,
    description
  }
};

export default function Silver3CaseRoute() {
  return <Silver3CasePage />;
}
