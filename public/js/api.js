export { fetchBookmark, getBookmarks, postBookmark, deleteBookmark };

// all fetch calls live here
async function fetchBookmark(id) {
  const response = await fetch(`/bookmarks/${id}`);
  const data = await response.json();
  return data;
}

async function getBookmarks() {
  const bookmarksUrl = "/bookmarks";
  try {
    const response = await fetch(bookmarksUrl);
    if (!response.ok) {
      throw new Error("Response status: " + response.status);
    }
    const result = await response.json();
    return result.reverse(); // newest bookmarks on top;
  } catch (error) {
    console.error(error.message);
  }
}

// all fetch calls that use apiHelper() live here
async function postBookmark(data) {
  return apiHelper(undefined, "POST", data);
}

async function deleteBookmark(id) {
  return apiHelper(id, "DELETE");
}

// internal helper for functions above
async function apiHelper(id, method, data) {
  let success;

  if (id) {
    id = "/" + id;
  } else {
    id = "";
  }
  if (data) {
    data = JSON.stringify(data);
  } else {
    data = "";
  }

  try {
    const response = await fetch("/bookmarks" + id, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      success = false;
      throw new Error(`HTTP error! status ${response.status}`);
    } else {
      success = true;
    }
  } catch (error) {
    success = false;
    console.error("Fetch error:", error);
  }

  return success;
}

