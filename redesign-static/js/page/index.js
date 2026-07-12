import {getPosts} from "../api/post-api.js";
import { formatDateTime } from "../utils/date-format.js";
import { setOptionalImage, setProfileImage } from "../utils/image.js";

const postListContainer = document.getElementById("post-list-container");
const postCardTemplate = document.getElementById("post-card-template");

const mostViewPostContainer = document.getElementById("rank-list");
const mostViewPostCardTemplate = document.getElementById("rank-item-template");



const VALID_FILTERS = ["RECENT", "POPULAR", "MINE"];

const EMPTY_STATE_CONFIG = {
  RECENT: {
    title: "아직 올라온 이야기가 없어요.",
    description: "오늘 떠오른 생각을 가장 먼저 나눠보세요.",
  },
  POPULAR: {
    title: "아직 인기 게시글이 없어요.",
    description: "게시글에 좋아요와 댓글을 남겨보세요.",
  },
  MINE: {
    title: "작성한 게시글이 없어요.",
    description: "첫 번째 이야기를 작성해보세요.",
  },
};

const getCurrentFilter = () => {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get("filter") ?? "RECENT";

  return VALID_FILTERS.includes(filter) ? filter : "RECENT";
};

const updateActiveFilter = (filter) => {
  document.querySelectorAll("[data-filter]").forEach((link) => {
    const isActive = link.dataset.filter === filter;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};


const renderPosts = (posts, filter) => {
  postListContainer.innerHTML = "";

  if (!posts || posts.length === 0) {
    const emptyState = EMPTY_STATE_CONFIG[filter];

    postListContainer.innerHTML = `
      <div class="empty-post-message" role="status">
        <strong>${emptyState.title}</strong>
        <p>${emptyState.description}</p>
        <a class="empty-post-action" href="post-create.html">
          게시글 작성하기
        </a>
      </div>
    `;

    return;
  }
    posts.forEach((post) => {
        const postElement = postCardTemplate.content.cloneNode(true);

        postElement.querySelector(".post-link").href = `/redesign-static/html/post-detail.html?postId=${post.id}`;
        postElement.querySelector(".post-title").textContent = post.title;
        postElement.querySelector(".post-summary").textContent = post.content;
        setOptionalImage(postElement.querySelector(".post-content-img"), post.contentImg);
        postElement.querySelector(".post-like-count").textContent = `좋아요 ${post.likeCount}`;
        postElement.querySelector(".post-comment-count").textContent = `댓글 ${post.commentCount}`;
        postElement.querySelector(".post-view-count").textContent = `조회수 ${post.viewCount}`;
        postElement.querySelector(".post-created-at").textContent = formatDateTime(post.createdAt);
        setProfileImage(postElement.querySelector(".post-author-img"), post.profileImg);
        postElement.querySelector(".post-author-nickname").textContent = post.nickname;

        postListContainer.appendChild(postElement);
    });
};

const renderMostViewPosts = (posts) => {
    mostViewPostContainer.innerHTML = "";

    if (!posts || posts.length === 0) {
        return;
    }

    posts.forEach((post, index) => {
        const postElement =
            mostViewPostCardTemplate.content.cloneNode(true);

        postElement.querySelector(".rank").textContent = index + 1;
        postElement.querySelector(".rank-title").textContent = post.title;
        postElement.querySelector(".rank-author").textContent = post.username;
        postElement.querySelector(".rank-item").href =
            `post-detail.html?postId=${post.id}`;

        mostViewPostContainer.appendChild(postElement);
    });
};

const init = async () => {
  const filter = getCurrentFilter();

  updateActiveFilter(filter);

  try {
    const response = await getPosts(filter);

    renderPosts(response.data.posts, filter);
    renderMostViewPosts(response.data.mostViewPosts);
  } catch (error) {
    console.error(error);
  }
};

init();
