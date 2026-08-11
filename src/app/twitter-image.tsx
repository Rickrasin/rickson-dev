import { ImageResponse } from "next/og";
import { getSocialLogoDataUrl } from "@/shared/lib/socialPreviewAsset";
import { SocialPreview, SOCIAL_IMAGE_SIZE } from "@/shared/ui/SocialPreview";

export const alt = "Chapéu da marca Rickson.dev — Rickson de Oliveira, desenvolvedor de software";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function TwitterImage() {
  const logoSrc = await getSocialLogoDataUrl();

  return new ImageResponse(<SocialPreview logoSrc={logoSrc} />, size);
}
