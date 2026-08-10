import type { Metadata } from "next";
import { Silver3CasePage } from "@/features/portfolio/ui/Silver3CasePage";

const title = "Gestão de chamados para a Silver3";
const description =
  "Case de uma plataforma de gestão de chamados de TI desenvolvida para a Silver3, com ambiente web, aplicativo móvel e uma API central.";

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
