import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = join(root, "app", "page.tsx");
const outputPath = join(root, "public", "portfolio-default.json");
const source = await readFile(pagePath, "utf8");
const startMarker = "const defaultProjects: Project[] = [";
const legacyMarker = "const projects: Project[] = [";
const start = source.indexOf(startMarker) >= 0
  ? source.indexOf(startMarker) + startMarker.length - 1
  : source.indexOf(legacyMarker) + legacyMarker.length - 1;
const end = source.indexOf("\n];\n\nfunction ArrowIcon", start) + 2;

if (start < 0 || end < 2) {
  throw new Error("Could not locate the default project data in app/page.tsx.");
}

const literal = source.slice(start, end);
const projects = Function(`"use strict"; return (${literal});`)();
const manifest = {
  version: 1,
  projects: projects.map((project, projectIndex) => ({
    ...project,
    enabled: project.enabled !== false,
    coverType: project.coverType ?? "video",
    gallery: (project.gallery ?? []).map((item, mediaIndex) => ({
      ...item,
      id: item.id ?? `${project.id}-${mediaIndex + 1}`,
      enabled: item.enabled !== false,
    })),
    impactRank: project.impactRank ?? projectIndex + 1,
  })),
};

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Generated ${outputPath}`);
