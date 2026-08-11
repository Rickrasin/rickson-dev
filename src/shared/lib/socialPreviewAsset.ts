import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function getSocialLogoDataUrl() {
  const logo = await readFile(
    join(process.cwd(), "public", "assets", "rickson-logo.svg"),
    "utf8"
  );

  const socialLogo = logo
    .replaceAll("#111A20", "#263841")
    .replaceAll("#2B383F", "#52656E")
    .replaceAll("#1D2F3B", "#3B515C")
    .replaceAll("#1C282F", "#32464F")
    .replaceAll("#384A55", "#718791");

  return `data:image/svg+xml;base64,${Buffer.from(socialLogo).toString("base64")}`;
}
