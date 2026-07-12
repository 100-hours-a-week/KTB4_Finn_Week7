import { deletePost, getPostById } from "../api/post-api.js";
import { likePost, unlikePost } from "../api/like-api.js";
import { formatDateTime } from "../utils/date-format.js";
import { setOptionalImage, setProfileImage } from "../utils/image.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("postId");

const likeButton = document.getElementById("post-like-button");
const likeCount = document.getElementById("like-count");
const postDeleteModal = document.getElementById("post-delete-modal");
const postDeleteCancelButton = document.getElementById(
  "post-delete-cancel-button",
);
const postDeleteConfirmButton = document.getElementById(
  "post-delete-confirm-button",
);

let currentLikeId = null;
let isLikePending = false;

function renderLikeState(isLiked) {
  likeButton.classList.toggle("is-liked", isLiked);
  likeButton.setAttribute("aria-pressed", String(isLiked));

  const likeIcon = likeButton.querySelector(".like-icon");

  if (likeIcon) {
    likeIcon.textContent = isLiked ? "♥" : "♡";
    return;
  }

  likeButton.style.backgroundColor = isLiked ? "#ACA0EB" : "#D9D9D9";
}

function openPostDeleteModal() {
  postDeleteModal.hidden = false;
}

function closePostDeleteModal() {
  postDeleteModal.hidden = true;
}

document.getElementById("post-edit-button").addEventListener("click", () => {
  window.location.href = "/html/post-update.html?postId=" + postId;
});
document.getElementById("post-delete-button").addEventListener("click", () => {
  openPostDeleteModal();
});

postDeleteCancelButton.addEventListener("click", closePostDeleteModal);

postDeleteModal.addEventListener("click", (event) => {
  if (event.target === postDeleteModal) {
    closePostDeleteModal();
  }
});

postDeleteConfirmButton.addEventListener("click", async () => {
  try {
    await deletePost(postId);
    window.location.href = "/html/index.html";
  } catch (error) {
    console.error("Error deleting post:", error);
    closePostDeleteModal();
  }
});

likeButton.addEventListener("click", async () => {
  if (isLikePending) {
    return;
  }

  const previousLikeId = currentLikeId;
  const wasLiked = previousLikeId !== null;
  const previousLikeCount = Number(likeCount.textContent);

  isLikePending = true;
  currentLikeId = wasLiked ? null : currentLikeId;
  likeCount.textContent = previousLikeCount + (wasLiked ? -1 : 1);
  renderLikeState(!wasLiked);

  try {
    if (wasLiked) {
      await unlikePost(previousLikeId);
    } else {
      const response = await likePost(postId);
      currentLikeId = response.data.id;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    currentLikeId = previousLikeId;
    likeCount.textContent = previousLikeCount;
    renderLikeState(wasLiked);
  } finally {
    isLikePending = false;
  }
});

function renderPostDetail(post) {
  document.getElementById("post-title").textContent = post.title;
  document.getElementById("post-content").textContent = post.content;
  document.getElementById("post-created-at").textContent = formatDateTime(
    post.createdAt,
  );
  likeCount.textContent = post.likeCount;
  document.getElementById("comment-count").textContent = post.commentCount;
  document.getElementById("view-count").textContent = post.viewCount;
  setOptionalImage(document.getElementById("post-image"), post.contentImg);

  document.getElementById("post-edit-button").style.display = post.isMine
    ? "inline-block"
    : "none";
  document.getElementById("post-delete-button").style.display = post.isMine
    ? "inline-block"
    : "none";

  document.getElementById("post-author").textContent = post.nickname;
  setProfileImage(document.getElementById("post-author-img"), post.profileImg);

  currentLikeId = post.like !== null ? post.like.id : null;
  renderLikeState(post.like !== null);
}

const init = async () => {
  const response = await getPostById(postId);

  const postInfo = response.data;

  renderPostDetail(postInfo);
};

init();
