export type MediaAspect = "portrait" | "landscape" | "square";
export type MediaType = "video" | "image";

export type PortfolioMedia = {
  id: string;
  type: MediaType;
  src: string;
  poster?: string;
  label: string;
  aspect: MediaAspect;
  enabled: boolean;
  storageKey?: string;
};

export type PortfolioProject = {
  id: string;
  year: string;
  title: string;
  region: string;
  status: "Confirmed";
  discipline: string;
  summary: string;
  role: string;
  deliverables: string[];
  media?: string;
  poster?: string;
  coverType?: MediaType;
  gallery: PortfolioMedia[];
  impactRank: number;
  accent: string;
  enabled: boolean;
};

export type PortfolioManifest = {
  version: number;
  projects: PortfolioProject[];
  updatedAt?: string;
  updatedBy?: string;
};

export const CURRENT_PORTFOLIO_VERSION = 4;

const MAX_PROJECTS = 50;
const MAX_MEDIA_PER_PROJECT = 200;

export function normalizeManifest(input: unknown): PortfolioManifest {
  if (!input || typeof input !== "object") {
    throw new Error("Portfolio data must be an object.");
  }

  const candidate = input as Partial<PortfolioManifest>;
  if (!Array.isArray(candidate.projects) || candidate.projects.length < 1) {
    throw new Error("Portfolio data must include at least one project.");
  }
  if (candidate.projects.length > MAX_PROJECTS) {
    throw new Error(`Portfolio data supports up to ${MAX_PROJECTS} projects.`);
  }

  const seenProjects = new Set<string>();
  const projects = candidate.projects.map((project, projectIndex) => {
    if (!project || typeof project !== "object") {
      throw new Error(`Project ${projectIndex + 1} is invalid.`);
    }

    const source = project as Partial<PortfolioProject>;
    const id = safeId(source.id, `project-${projectIndex + 1}`);
    if (seenProjects.has(id)) {
      throw new Error(`Duplicate project id: ${id}`);
    }
    seenProjects.add(id);

    const rawGallery = Array.isArray(source.gallery) ? source.gallery : [];
    if (rawGallery.length > MAX_MEDIA_PER_PROJECT) {
      throw new Error(
        `${plainText(source.title, id)} has more than ${MAX_MEDIA_PER_PROJECT} media assets.`,
      );
    }

    const seenMedia = new Set<string>();
    const gallery = rawGallery.map((item, mediaIndex) => {
      const media = item as Partial<PortfolioMedia>;
      const fallbackId = `${id}-${mediaIndex + 1}`;
      const mediaId = safeId(media.id, fallbackId);
      const uniqueId = seenMedia.has(mediaId) ? `${mediaId}-${mediaIndex + 1}` : mediaId;
      seenMedia.add(uniqueId);

      return {
        id: uniqueId,
        type: media.type === "image" ? "image" : "video",
        src: safeMediaPath(media.src),
        poster: media.poster ? safeMediaPath(media.poster) : undefined,
        label: plainText(media.label, `Asset ${mediaIndex + 1}`, 100),
        aspect: normalizeAspect(media.aspect),
        enabled: media.enabled !== false,
        storageKey: media.storageKey ? safeStorageKey(media.storageKey) : undefined,
      } satisfies PortfolioMedia;
    });

    return {
      id,
      year: plainText(source.year, "", 12),
      title: plainText(source.title, id, 100),
      region: plainText(source.region, "", 100),
      status: "Confirmed",
      discipline: plainText(source.discipline, "", 150),
      summary: plainText(source.summary, "", 600),
      role: plainText(source.role, "", 300),
      deliverables: Array.isArray(source.deliverables)
        ? source.deliverables.slice(0, 30).map((item) => plainText(item, "", 120))
        : [],
      media: source.media ? safeMediaPath(source.media) : undefined,
      poster: source.poster ? safeMediaPath(source.poster) : undefined,
      coverType: source.coverType === "image" ? "image" : "video",
      gallery,
      impactRank:
        typeof source.impactRank === "number" && Number.isFinite(source.impactRank)
          ? Math.max(1, Math.round(source.impactRank))
          : projectIndex + 1,
      accent: normalizeColor(source.accent),
      enabled: source.enabled !== false,
    } satisfies PortfolioProject;
  });

  return {
    version:
      typeof candidate.version === "number" &&
      Number.isInteger(candidate.version) &&
      candidate.version > 0
        ? candidate.version
        : 1,
    projects,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt.slice(0, 80) : undefined,
    updatedBy:
      typeof candidate.updatedBy === "string" ? candidate.updatedBy.slice(0, 200) : undefined,
  };
}

export function publicManifest(manifest: PortfolioManifest): PortfolioManifest {
  return {
    ...manifest,
    projects: manifest.projects
      .filter((project) => project.enabled)
      .map((project) => ({
        ...project,
        gallery: project.gallery.filter((item) => item.enabled),
      })),
  };
}

function plainText(value: unknown, fallback: string, maxLength = 200): string {
  if (typeof value !== "string") return fallback;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  return cleaned ? cleaned.slice(0, maxLength) : fallback;
}

function safeId(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value : fallback;
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return normalized || fallback;
}

function safeMediaPath(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Every media asset needs a source path.");
  }
  const path = value.trim();
  if (
    path.startsWith("/media/") ||
    path.startsWith("/gallery/") ||
    path.startsWith("/origin/") ||
    path.startsWith("/api/portfolio/media/")
  ) {
    return path.slice(0, 1000);
  }
  throw new Error(`Unsupported media path: ${path.slice(0, 120)}`);
}

function safeStorageKey(value: string): string {
  const key = value.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!key.startsWith("portfolio/") || key.includes("..")) {
    throw new Error("Invalid media storage key.");
  }
  return key.slice(0, 500);
}

function normalizeAspect(value: unknown): MediaAspect {
  if (value === "landscape" || value === "square") return value;
  return "portrait";
}

function normalizeColor(value: unknown): string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
    ? value
    : "#d7ff34";
}
