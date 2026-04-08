export { postBookmark, deleteBookmark };

// all fetch calls live here
async function postBookmark(data) {
  let success;
  try {
    const response = await fetch("/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

async function deleteBookmark(id) {
  let success;
  try {
    const response = await fetch(`/bookmarks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
