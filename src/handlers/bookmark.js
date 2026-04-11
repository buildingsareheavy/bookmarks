import { filePath } from "../utils/files.js";
import fs from "node:fs/promises";
import { pushToJSONFile } from "../utils/files.js";
import { sendJSON, sendError } from "../utils/response.js";

export { getBookmarks, postBookmark, getBookmarkById, deleteBookmarkById };

// GET bookmarks (all)
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

// POST new bookmark
async function postBookmark(res, req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk.toString();
  }

  try {
    let data = JSON.parse(body);
    let date = new Date();
    data["id"] = crypto.randomUUID();
    data["createdAt"] = date.toISOString();
    data["tags"] = [];
    // console.log("postBookmark()", data);
    await pushToJSONFile(filePath("data/bookmarks.json"), data);
    sendJSON(res, 200, data);
  } catch {
    sendError(res, 400, "Not found");
  }
}

// GET bookmark (by id)
async function getBookmarkById(res, bookmarkId) {
  try {
    let data = await fs.readFile(filePath("data/bookmarks.json"), {
      encoding: "utf8",
    });
    data = JSON.parse(data);
    const isValidId = data.find(({ id }) => id === bookmarkId);
    if (isValidId) {
      data = isValidId;
      sendJSON(res, 200, data);
      //   console.log("getBookmarkById(): ", data);
    } else {
      sendError(res, 404, "Bookmark not found");
    }
  } catch {
    sendError(res, 400, "Failed to read bookmarks");
  }
}

// DELETE bookmark (by id)
async function deleteBookmarkById(res, bookmarkId) {
  try {
    let data = await fs.readFile(filePath("data/bookmarks.json"), {
      encoding: "utf8",
    });
    // console.log("deleteBookmarkById() data: ", data);
    data = JSON.parse(data);
    const isValidId = data.find(({ id }) => id === bookmarkId);
    // console.log("deleteBookmarkById() isValidId: ", isValidId);
    if (isValidId) {
      data = data.filter((bookmark) => bookmark.id !== isValidId.id);
      sendJSON(res, 200, data);
      await fs.writeFile(
        filePath("data/bookmarks.json"),
        JSON.stringify(data, null, 2),
        "utf8",
      );
    } else {
      sendError(res, 404, "Bookmark not found");
    }
  } catch {
    sendError(res, 400, "Failed to read bookmarks");
  }
}
