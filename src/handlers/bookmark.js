import { sendJSON, sendError } from "../utils/response.js";
import { filePath } from "../utils/files.js";
import fs from "node:fs/promises";

export { getBookmarks };

async function getBookmarks(res) {
  try {
    let data = await fs.readFile(filePath("data/bookmarks.json"), {
      encoding: "utf8",
    });
    data = JSON.parse(data);
    // console.log("getBookmarks():", data);
    sendJSON(res, 200, data);
  } catch {
    sendError(res, 400, "Failed to read bookmarks");
  }
}
