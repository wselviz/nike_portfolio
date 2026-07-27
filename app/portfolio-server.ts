import { env } from "cloudflare:workers";
import { getChatGPTUser } from "./chatgpt-auth";
import {
  CURRENT_PORTFOLIO_VERSION,
  normalizeManifest,
  type PortfolioManifest,
} from "./portfolio-shared";

type PortfolioEnv = {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
  PORTFOLIO_OWNER_EMAIL?: string;
};

const runtime = env as unknown as PortfolioEnv;

export async function ensurePortfolioSchema() {
  await runtime.DB.prepare(`
    CREATE TABLE IF NOT EXISTS portfolio_configs (
      id INTEGER PRIMARY KEY,
      manifest_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT NOT NULL
    )
  `).run();
}

export async function getPortfolioManifest(request: Request): Promise<PortfolioManifest> {
  await ensurePortfolioSchema();
  const row = await runtime.DB.prepare(
    "SELECT manifest_json FROM portfolio_configs WHERE id = ?1",
  )
    .bind(1)
    .first<{ manifest_json: string }>();

  if (row?.manifest_json) {
    const stored = normalizeManifest(JSON.parse(row.manifest_json));
    if (stored.version >= CURRENT_PORTFOLIO_VERSION) {
      return stored;
    }

    const defaults = await getDefaultManifest(request);
    const upgraded = upgradePortfolioManifest(stored, defaults);
    await runtime.DB.prepare(
      `UPDATE portfolio_configs
        SET manifest_json = ?1, updated_at = CURRENT_TIMESTAMP, updated_by = ?2
        WHERE id = ?3`,
    )
      .bind(JSON.stringify(upgraded), "system-migration-v4", 1)
      .run();
    return upgraded;
  }

  const manifest = await getDefaultManifest(request);
  await runtime.DB.prepare(
    `INSERT OR IGNORE INTO portfolio_configs
      (id, manifest_json, updated_at, updated_by)
      VALUES (?1, ?2, CURRENT_TIMESTAMP, ?3)`,
  )
    .bind(1, JSON.stringify(manifest), "system")
    .run();
  return manifest;
}

async function getDefaultManifest(request: Request): Promise<PortfolioManifest> {
  const defaultsResponse = await runtime.ASSETS.fetch(
    new Request(new URL("/portfolio-default.json", request.url)),
  );
  if (!defaultsResponse.ok) {
    throw new Error("The default portfolio manifest is unavailable.");
  }
  return normalizeManifest(await defaultsResponse.json());
}

function upgradePortfolioManifest(
  stored: PortfolioManifest,
  defaults: PortfolioManifest,
): PortfolioManifest {
  const defaultProjects = new Map(
    defaults.projects.map((project) => [project.id, project]),
  );
  const projects = stored.projects.map((project) => {
    const defaultProject = defaultProjects.get(project.id);
    if (!defaultProject) return project;

    if (project.id !== "amd") {
      return {
        ...project,
        summary: defaultProject.summary,
      };
    }

    return {
      ...project,
      year: defaultProject.year,
      discipline: defaultProject.discipline,
      summary: defaultProject.summary,
      role: defaultProject.role,
      deliverables: defaultProject.deliverables,
    };
  }).sort((a, b) => Number(b.year) - Number(a.year));

  return normalizeManifest({
    ...stored,
    version: CURRENT_PORTFOLIO_VERSION,
    projects,
  });
}

export async function savePortfolioManifest(
  manifest: PortfolioManifest,
  email: string,
): Promise<PortfolioManifest> {
  const next = normalizeManifest({
    ...manifest,
    updatedAt: new Date().toISOString(),
    updatedBy: email,
  });
  await runtime.DB.prepare(
    `INSERT INTO portfolio_configs
      (id, manifest_json, updated_at, updated_by)
      VALUES (?1, ?2, CURRENT_TIMESTAMP, ?3)
      ON CONFLICT(id) DO UPDATE SET
        manifest_json = excluded.manifest_json,
        updated_at = CURRENT_TIMESTAMP,
        updated_by = excluded.updated_by`,
  )
    .bind(1, JSON.stringify(next), email)
    .run();
  return next;
}

export async function requirePortfolioAdmin() {
  const user = await getChatGPTUser();
  if (!user) {
    return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  }

  const ownerEmail = runtime.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase();
  if (!ownerEmail || user.email.trim().toLowerCase() !== ownerEmail) {
    return {
      error: Response.json(
        { error: "Not found." },
        { status: 403 },
      ),
    };
  }

  return { user };
}

export function rejectCrossOriginMutation(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: "Request denied." }, { status: 403 });
  }
  return null;
}

export function portfolioRuntime() {
  return runtime;
}
