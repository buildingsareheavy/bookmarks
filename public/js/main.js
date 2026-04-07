import { postBookmark } from "./api.js";

const dialog = document.getElementById("add-new-dialog");
const main = document.querySelector("main");
const popover = document.getElementById("submit-popover");

async function getBookmarks() {
  const bookmarksUrl = "/bookmarks";
  try {
    const response = await fetch(bookmarksUrl);
    if (!response.ok) {
      throw new Error("Response status: " + response.status);
    }
    const result = await response.json();
    main.innerHTML = result
      .map(
        (bookmark) => `
        <article>
    <h3><a href="${bookmark.url}">${bookmark.title}</a></h3>
    <div aria-label="meta information" class="meta-info">
          <p aria-label="tags">${bookmark.tags && bookmark.tags.map((tag) => `<span> ${tag} </span>`).join("")} </p>
          <p aria-label="created date">${new Date(
            bookmark.createdAt,
          ).toLocaleString("en-GB", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}</p>
        </div>
        <button class="modify" aria-label="bookmark options">...</button>
        </article>
    `,
      )
      .join("");
  } catch (error) {
    console.error(error.message);
  }
}

getBookmarks();

const newBookmarkForm = document.getElementById("add-new-form");

async function submitNewBookmark(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const dataObject = Object.fromEntries(formData.entries());

  const result = await postBookmark(dataObject);
  popover.setAttribute("data-success", result);

  if (result) {
    getBookmarks();

    popover.textContent = "new bookmark added!";
  } else {
    popover.textContent = "something went wrong!";
  }
  dialog.close();
  popover.showPopover();
  form.reset();
}

newBookmarkForm.addEventListener("submit", submitNewBookmark);
