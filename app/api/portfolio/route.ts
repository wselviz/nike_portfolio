import {
  getPortfolioManifest,
  requirePortfolioAdmin,
  savePortfolioManifest,
} from "../../portfolio-server";
import {
  normalizeManifest,
  publicManifest,
} from "../../portfolio-shared";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const wantsAdminData = url.searchParams.get("admin") === "1";
    let adminEmail: string | undefined;

    if (wantsAdminData) {
      const authorization = await requirePortfolioAdmin();
      if ("error" in authorization) return authorization.error;
      adminEmail = authorization.user.email;
    }

    const manifest = await getPortfolioManifest(request);
    return Response.json(
      {
        manifest: wantsAdminData ? manifest : publicManifest(manifest),
        admin: adminEmail ? { email: adminEmail } : undefined,
      },
      {
        headers: {
          "Cache-Control": wantsAdminData
            ? "private, no-store"
            : "public, max-age=15, stale-while-revalidate=45",
        },
      },
    );
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const authorization = await requirePortfolioAdmin();
    if ("error" in authorization) return authorization.error;

    const payload = (await request.json()) as { manifest?: unknown };
    const manifest = normalizeManifest(payload.manifest);
    const saved = await savePortfolioManifest(manifest, authorization.user.email);
    return Response.json(
      { manifest: saved, admin: { email: authorization.user.email } },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return routeError(error);
  }
}

function routeError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected portfolio error.";
  const status =
    message.includes("must") ||
    message.includes("Unsupported") ||
    message.includes("Duplicate") ||
    message.includes("more than")
      ? 400
      : 500;
  return Response.json({ error: message }, { status });
}
