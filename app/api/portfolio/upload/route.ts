import {
  portfolioRuntime,
  rejectCrossOriginMutation,
  requirePortfolioAdmin,
} from "../../../portfolio-server";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const crossOriginError = rejectCrossOriginMutation(request);
    if (crossOriginError) return crossOriginError;

    const authorization = await requirePortfolioAdmin();
    if ("error" in authorization) return authorization.error;

    const contentType = request.headers.get("content-type")?.split(";")[0].trim() ?? "";
    if (!contentType.startsWith("image/") && !contentType.startsWith("video/")) {
      return Response.json(
        { error: "Choose an image, GIF, or video file." },
        { status: 415 },
      );
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_UPLOAD_BYTES) {
      return Response.json(
        { error: "Each upload must be 500 MB or smaller." },
        { status: 413 },
      );
    }
    if (!request.body) {
      return Response.json({ error: "The upload is empty." }, { status: 400 });
    }

    const encodedName = request.headers.get("x-file-name") ?? "asset";
    const originalName = safeDecode(encodedName);
    const filename = sanitizeFilename(originalName);
    const projectId = sanitizeSegment(request.headers.get("x-project-id") ?? "misc");
    const role = request.headers.get("x-media-role") === "poster" ? "poster" : "gallery";
    const key = `portfolio/${projectId}/${crypto.randomUUID()}-${filename}`;
    const runtime = portfolioRuntime();

    await runtime.MEDIA.put(key, request.body, {
      httpMetadata: { contentType },
      customMetadata: {
        uploadedBy: authorization.user.email,
        originalName: originalName.slice(0, 240),
        role,
      },
    });

    const type = contentType.startsWith("video/") ? "video" : "image";
    const src = `/api/portfolio/media/${key
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")}`;

    return Response.json(
      {
        asset: {
          id: `${projectId}-${crypto.randomUUID()}`,
          type,
          src,
          label: labelFromFilename(originalName),
          aspect: "portrait",
          enabled: true,
          storageKey: key,
        },
      },
      { status: 201, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function sanitizeFilename(value: string) {
  const extensionMatch = value.toLowerCase().match(/\.[a-z0-9]{1,8}$/);
  const extension = extensionMatch?.[0] ?? "";
  const stem = value
    .slice(0, extension ? -extension.length : undefined)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return `${stem || "asset"}${extension}`;
}

function sanitizeSegment(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "misc"
  );
}

function labelFromFilename(value: string) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim()
    .slice(0, 100);
}
