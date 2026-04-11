import { fetchBookmark, getBookmarks, postBookmark, deleteBookmark } from "./api.js";

const dialog = document.getElementById("add-new-dialog");
const editDialog = document.getElementById("edit-dialog");
const editBookmarkTitle = document.getElementById("edit-title");
const editBookmarkUrl = document.getElementById("edit-url");
const main = document.querySelector("main");
const newBookmarkForm = document.getElementById("add-new-form");
const confirmDialog = document.getElementById("confirm-deletion-dialog");
const confirmDeleteBookmarkButton =
  document.getElementById("confirm-delete-yes");
const popover = document.getElementById("submit-popover");
let clickId;


function renderBookmarks(bookmarks) {
  main.innerHTML = bookmarks
    .map(
      (bookmark) => `
        <article data-id="${bookmark.id}">
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
        <button class="modify" command="show-modal" commandfor="edit-dialog" aria-label="bookmark options">...</button>
        </article>
    `,
    )
    .join("");
}

async function refreshBookmarks() {
  const bookmarks = await getBookmarks();
  renderBookmarks(bookmarks);
}

async function submitNewBookmark(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const dataObject = Object.fromEntries(formData.entries());

  const result = await postBookmark(dataObject);
  popover.setAttribute("data-success", result);

  if (result) {
    refreshBookmarks();
    popover.textContent = "new bookmark added!";
  } else {
    popover.textContent = "something went wrong!";
  }
  dialog.close();
  popover.showPopover();
  form.reset();
}

async function isDeleted() {
  const result = await deleteBookmark(clickId);
  if (result) {
    refreshBookmarks();
    confirmDialog.close();
    editDialog.close();
  } else {
    console.error("Error: ", result);
  }
}

refreshBookmarks();

newBookmarkForm.addEventListener("submit", submitNewBookmark);

confirmDeleteBookmarkButton.addEventListener("click", isDeleted);

main.addEventListener("click", async (event) => {
  let clickTarget = event.target;
  const isClickMatch = clickTarget.matches("button.modify");
  if (isClickMatch) {
    const clickParent = clickTarget.closest("article");
    clickId = clickParent.getAttribute("data-id");

    const data = await fetchBookmark(clickId);

    editBookmarkTitle.value = data.title;
    editBookmarkUrl.value = data.url;
  }
});