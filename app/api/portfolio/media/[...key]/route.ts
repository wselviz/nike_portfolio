import { portfolioRuntime } from "../../../../portfolio-server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ key: string[] }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { key: segments } = await context.params;
  const key = segments.map((segment) => decodeURIComponent(segment)).join("/");
  if (!key.startsWith("portfolio/") || key.includes("..")) {
    return new Response("Invalid media key.", { status: 400 });
  }

  const runtime = portfolioRuntime();
  const object = await runtime.MEDIA.get(key, {
    range: request.headers,
  });
  if (!object) {
    return new Response("Media not found.", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=31536000, immutable");

  const range = object.range;
  if (request.headers.has("range") && range) {
    const end = range.offset + range.length - 1;
    headers.set("content-range", `bytes ${range.offset}-${end}/${object.size}`);
    headers.set("content-length", String(range.length));
    return new Response(object.body, { status: 206, headers });
  }

  headers.set("content-length", String(object.size));
  return new Response(object.body, { headers });
}

export async function HEAD(_request: Request, context: RouteContext) {
  const { key: segments } = await context.params;
  const key = segments.map((segment) => decodeURIComponent(segment)).join("/");
  if (!key.startsWith("portfolio/") || key.includes("..")) {
    return new Response(null, { status: 400 });
  }

  const object = await portfolioRuntime().MEDIA.head(key);
  if (!object) return new Response(null, { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("content-length", String(object.size));
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(null, { headers });
}
