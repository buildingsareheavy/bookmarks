export { postBookmark };

// all fetch calls live here
async function postBookmark(data) {
  try {
    const response = await fetch("/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP error! status ${response.status}`);
    console.log(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
