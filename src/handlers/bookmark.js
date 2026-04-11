import { readBookmarks, writeBookmarks } from "../utils/files.js";
import { sendJSON, sendError } from "../utils/response.js";
import { Bookmark } from "../utils/bookmark.js";

export { getBookmarks, postBookmark, getBookmarkById, deleteBookmarkById };

// GET bookmarks (all)
async function getBookmarks(res) {
  try {
    let data = await readBookmarks();
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
    // console.log("postBookmark() data ", data);
    data = new Bookmark(data.title, data.url);
    // console.log("postBookmark() data after Bookmark Class ", data);
    const allBookmarks = await readBookmarks();
    allBookmarks.push(data);
    await writeBookmarks(allBookmarks);
    // console.log("Object added successfully");
    sendJSON(res, 200, data);
  } catch {
    sendError(res, 400, "Not found");
  }
}

// GET bookmark (by id)
async function getBookmarkById(res, bookmarkId) {
  try {
    let data = await readBookmarks();
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
    let data = await readBookmarks();
    // console.log("deleteBookmarkById() data: ", data);
    const isValidId = data.find(({ id }) => id === bookmarkId);
    // console.log("deleteBookmarkById() isValidId: ", isValidId);
    if (isValidId) {
      data = data.filter((bookmark) => bookmark.id !== isValidId.id);
      await writeBookmarks(data);
      sendJSON(res, 200, data);
    } else {
      sendError(res, 404, "Bookmark not found");
    }
  } catch {
    sendError(res, 400, "Failed to read bookmarks");
  }
}
