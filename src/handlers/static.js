import { extname, join } from "node:path";
import { filePath } from "../utils/files.js";
import fs from "node:fs/promises";
import { sendError } from "../utils/response.js";

export { serveStaticFiles };

const contentType = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

async function serveStaticFiles(res, url) {
  const fileType = url === "/" ? ".html" : extname(url);
  try {
    let pathName = join("./public", url);
    if (url === "/") {
      pathName = "public/index.html";
    }
    let data = await fs.readFile(filePath(pathName), {
      encoding: "utf-8",
    });

    res.setHeader(
      "Content-Type",
      contentType[fileType] || "application/octet-stream",
    );
    res.statusCode = 200;
    res.end(data);
  } catch {
    sendError(res, 404, "Not found");
  }
}
