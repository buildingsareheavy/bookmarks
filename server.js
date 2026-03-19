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
};

const filePath = (fileName) =>
  join(dirname(fileURLToPath(import.meta.url)), fileName);

const server = createServer(async (req, res) => {
  let url = req.url;
  let status = 200;
  let message;
  if (url === "/") {
    try {
      status = 200;
      const data = await fs.readFile(filePath("public/index.html"), {
        encoding: "utf-8",
      });
      message = data;
    } catch (error) {
      status = 404;
      message = "<h1>File Not Found!</h1>";
    }
    res.setHeader("Content-Type", "text/html");
  } else if (url === "/bookmarks") {
    try {
      status = 200;
      const data = await fs.readFile(filePath("data/bookmarks.json"), {
        encoding: "utf8",
      });
      message = JSON.parse(data);
    } catch (err) {
      status = 400;
      message = [{ error: "Failed to read bookmarks" }];
    }
    message = JSON.stringify(message);
    res.setHeader("Content-Type", "application/json");
  } else {
    try {
      status = 200;
      const data = await fs.readFile(filePath(join("public", url)), {
        encoding: "utf-8",
      });
      const fileType = extname(url);
      res.setHeader("Content-Type", contentType[fileType]);
      message = data;
    } catch (err) {
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
