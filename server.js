import { createServer } from "node:http";
import fs from "node:fs/promises";
const hostname = "localhost";
const port = 3000;

const server = createServer(async (req, res) => {
  let url = req.url;
  let status = 200;
  let message;
  if (url === "/") {
    message = [{ text: "hello from node!" }];
  } else if (url === "/bookmarks") {
    try {
      const data = await fs.readFile("data/bookmarks.json", {
        encoding: "utf8",
      });
      const bookmarks = JSON.parse(data);
      message = bookmarks;
    } catch (err) {
      console.error(err);
      message = [{ error: "Failed to read bookmarks" }];
    }
  } else {
    message = [{ error: "Not found" }];
    status = 404;
  }
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(message));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
