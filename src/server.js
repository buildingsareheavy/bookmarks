import { createServer } from "node:http";
import { serveStaticFiles } from "./handlers/static.js";
import {
  getBookmarks,
  postBookmark,
  getBookmarkById,
  deleteBookmarkById,
} from "./handlers/bookmark.js";

const hostname = "localhost";
const port = 3000;

const server = createServer(async (req, res) => {
  let url = req.url;
  let idUrl = url.split("/").pop();

  if (url === "/bookmarks") {
    if (req.method === "GET") {
      await getBookmarks(res);
    } else if (req.method === "POST") {
      await postBookmark(res, req);
    }
  } else if (url.startsWith("/bookmarks/")) {
    if (req.method === "GET") {
      await getBookmarkById(res, idUrl);
    } else if (req.method === "DELETE") {
      await deleteBookmarkById(res, idUrl);
    }
  } else {
    await serveStaticFiles(res, url);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
