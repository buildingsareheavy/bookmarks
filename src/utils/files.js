import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "node:fs/promises";

export { filePath, pushToJSONFile };

const filePath = (fileName) => {
  return join(dirname(fileURLToPath(import.meta.url)), "../../" + fileName);
};

const pushToJSONFile = async function (destination, newBookmark) {
  try {
    let fileContents = await fs.readFile(destination, "utf8");

    let data = JSON.parse(fileContents);

    data.push(newBookmark);
    await fs.writeFile(destination, JSON.stringify(data, null, 2), "utf8");
    // console.log("Object added successfully");
  } catch (error) {
    console.error("Error", error);
  }
};
