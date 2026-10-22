import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function getSocialLogoDataUrl() {
  const logo = await readFile(
    join(process.cwd(), "public", "assets", "brand", "logo-vertical-branca.svg"),
    "utf8"
  );

  return `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
}
