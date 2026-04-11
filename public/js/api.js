export { postBookmark, deleteBookmark };


// all fetch calls live here
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

