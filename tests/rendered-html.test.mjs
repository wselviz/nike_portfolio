import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://will-selvis-nike.example/", {
      headers: { accept: "text/html", host: "will-selvis-nike.example" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Nike project universe", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Will Selvis — Nike Project Universe<\/title>/i);
  assert.match(html, /NIKE PROJECT UNIVERSE/);
  assert.match(html, /THE WORK/);
  assert.match(html, /Toronto Air Max 95/);
  assert.match(html, /Air Max Day Worldwide/);
  assert.match(html, /Canada Soccer Jersey/);
});

test("ships finished metadata with no starter preview", async () => {
  const response = await render();
  const html = await response.text();

  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.doesNotMatch(html, /Your site is taking shape|SkeletonPreview|react-loading-skeleton/i);
  assert.match(html, /property="og:image"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  assert.match(html, /https:\/\/will-selvis-nike\.example\/og\.png/);
});
