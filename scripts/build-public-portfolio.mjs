import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultPath = path.join(projectRoot, "public", "portfolio-default.json");
const ownerStatePath = path.join(projectRoot, "data", "portfolio-owner-state.json");
const outputPath = path.join(projectRoot, "public", "portfolio-public.json");

const defaults = JSON.parse(await readFile(defaultPath, "utf8"));
const ownerState = JSON.parse(await readFile(ownerStatePath, "utf8"));
const defaultProjects = new Map(defaults.projects.map((project) => [project.id, project]));

const publishedProjects = ownerState.projects.map((ownerProject) => {
  const sourceProject = defaultProjects.get(ownerProject.id);
  if (!sourceProject) {
    throw new Error(`Missing default project metadata for ${ownerProject.id}.`);
  }

  const defaultMedia = new Map(
    (sourceProject.gallery ?? []).map((item) => [item.src, item]),
  );
  const gallery = ownerProject.gallery
    .filter((item) => item.enabled)
    .map((item, index) => {
      const sourceItem = defaultMedia.get(item.src);
      return {
        ...sourceItem,
        ...item,
        id: sourceItem?.id ?? `${ownerProject.id}-owner-${index + 1}`,
        src: publicAssetPath(item.src, item.type),
        poster: item.poster
          ? publicAssetPath(item.poster, "image")
          : sourceItem?.poster,
        enabled: true,
      };
    });

  return {
    ...sourceProject,
    gallery,
    enabled: true,
  };
});

const publicManifest = {
  version: defaults.version,
  projects: publishedProjects,
  updatedAt: ownerState.capturedAt,
  updatedBy: "owner-preview-snapshot",
};

await writeFile(
  outputPath,
  `${JSON.stringify({ manifest: publicManifest }, null, 2)}\n`,
  "utf8",
);

const assetCount = publishedProjects.reduce(
  (total, project) => total + project.gallery.length,
  0,
);
console.log(`Published ${publishedProjects.length} projects and ${assetCount} visible assets.`);

function publicAssetPath(source, type) {
  if (!source.startsWith("/api/portfolio/media/")) return source;

  const filename = decodeURIComponent(source.split("/").at(-1));
  const optimizedName =
    type === "image"
      ? filename.replace(/\.(png|jpe?g)$/i, ".webp")
      : filename;
  return `/owner-media/media/${optimizedName}`;
}
