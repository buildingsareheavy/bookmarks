import { createServer } from "node:http";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { extname, dirname, join } from "node:path";

const hostname = "localhost";
const port = 3000;

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

const filePath = (fileName) =>
  join(dirname(fileURLToPath(import.meta.url)), fileName);

const server = createServer(async (req, res) => {
  let url = req.url;
  let status;
  let message;

  const fileType = url === "/" ? ".html" : extname(url);

  if (url === "/bookmarks") {
    if (req.method === "GET") {
      try {
        status = 200;
        const data = await fs.readFile(filePath("data/bookmarks.json"), {
          encoding: "utf8",
        });
        message = JSON.parse(data);
      } catch {
        status = 400;
        message = [{ error: "Failed to read bookmarks" }];
      }
      message = JSON.stringify(message);
    } else if (req.method === "POST") {
      let body = "";
      for await (const chunk of req) {
        body += chunk.toString();
      }

      try {
        let message = JSON.parse(body);
        console.log("Recieved POST data", message);
        status = 200;
        message = JSON.stringify({
          message: "Data recieved!",
          received: message,
        });
      } catch {
        status = 400;
        message = [{ error: "Not found" }];
        message = JSON.stringify(message);
      }
    }
    res.setHeader("Content-Type", "application/json");
  } else {
    try {
      status = 200;
      let pathName = join("public", url);
      if (url === "/") {
        pathName = "public/index.html";
      }
      const data = await fs.readFile(filePath(pathName), {
        encoding: "utf-8",
      });

      res.setHeader(
        "Content-Type",
        contentType[fileType] || "application/octet-stream",
      );
      message = data;
    } catch {
      status = 404;
      message = [{ error: "Not found" }];
      message = JSON.stringify(message);
    }
  }
  res.statusCode = status;
  res.end(message);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
