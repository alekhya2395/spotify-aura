import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots");
const base = "http://localhost:3031";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await context.newPage();

await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(outDir, "home.png"), fullPage: true });

await page.getByRole("button", { name: "Chill", exact: true }).click();
await page.goto(`${base}/results`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: path.join(outDir, "results.png"), fullPage: true });

await page.goto(`${base}/why/3n3Ppam7vgaVa1iaRUc9Lp`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({
  path: path.join(outDir, "why-recommended.png"),
  fullPage: true,
});

await browser.close();
console.log("Screenshots saved to", outDir);
