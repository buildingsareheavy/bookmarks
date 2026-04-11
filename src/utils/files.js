import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "node:fs/promises";

export { filePath, readBookmarks, writeBookmarks };

const filePath = (fileName) => {
  return join(dirname(fileURLToPath(import.meta.url)), "../../" + fileName);
};

const readBookmarks = async function readBookmarks() {
  const data = await fs.readFile(filePath("data/bookmarks.json"), {
    encoding: "utf8",
  });

  return JSON.parse(data);
}

const writeBookmarks = async function writeBookmarks(data) {
  return await fs.writeFile(
    filePath("data/bookmarks.json"),
    JSON.stringify(data, null, 2),
    "utf8",
  );
}