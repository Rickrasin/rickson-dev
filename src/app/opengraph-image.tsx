import { ImageResponse } from "next/og";
import { SocialPreview, SOCIAL_IMAGE_SIZE } from "@/shared/ui/SocialPreview";

export const alt = "Rickson de Oliveira — Desenvolvedor de software";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<SocialPreview />, size);
}
