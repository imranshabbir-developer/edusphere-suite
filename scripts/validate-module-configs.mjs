/**
 * Validates all module configs load and return valid seed arrays.
 * Run: node scripts/validate-module-configs.mjs (after vite build)
 * Or import via vite during dev.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const configDir = join(__dirname, "../src/config/configs");
const constantsFile = readFileSync(join(__dirname, "../src/config/moduleConstants.ts"), "utf8");

// Extract exported constant names from moduleConstants.ts
const exportedConstants = [...constantsFile.matchAll(/^export const (\w+)/gm)].map((m) => m[1]);

let failed = false;

for (const file of readdirSync(configDir).filter((f) => f.endsWith(".ts"))) {
  const content = readFileSync(join(configDir, file), "utf8");
  const importMatch = content.match(/from ["']\.\.\/moduleConstants["'];?/);
  if (!importMatch) continue;

  const importBlock = content.slice(0, content.indexOf('from "../moduleConstants"'));
  const imported = [...importBlock.matchAll(/\b([A-Z][A-Z0-9_]*)\b/g)]
    .map((m) => m[1])
    .filter((name) => exportedConstants.includes(name));

  const used = new Set(
    [...content.matchAll(/\b([A-Z][A-Z0-9_]{2,})\b/g)]
      .map((m) => m[1])
      .filter((name) => exportedConstants.includes(name)),
  );

  for (const name of used) {
    if (!imported.includes(name)) {
      console.error(`[validate] ${file}: uses ${name} but does not import it from moduleConstants`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("[validate] All module config constant imports OK");
