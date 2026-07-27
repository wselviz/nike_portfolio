import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(projectRoot, "github-public", "owner-media");
const destination = path.join(projectRoot, "pages-dist", "owner-media");

await mkdir(path.dirname(destination), { recursive: true });
await cp(source, destination, { recursive: true });
console.log("Copied owner uploads into the GitHub Pages build.");
