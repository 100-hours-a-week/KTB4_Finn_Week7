import {getPosts} from "../api/post-api.js";
import { formatDateTime } from "../utils/date-format.js";
import { setProfileImage } from "../utils/image.js";

const postListContainer = document.getElementById("post-list-container");
const postCardTemplate = document.getElementById("post-card-template");

const renderPosts = (posts) => {
    postListContainer.innerHTML = "";

    if (!posts || posts.length === 0) {
        postListContainer.innerHTML = `
            <p class="empty-post-message">게시물이 없습니다.</p>
        `;
        return;
    }

    posts.forEach((post) => {
        const postElement = postCardTemplate.content.cloneNode(true);

        postElement.querySelector(".post-link").href = `/redesign-static/html/post-detail.html?postId=${post.id}`;
        postElement.querySelector(".post-title").textContent = post.title;
        postElement.querySelector(".post-like-count").textContent = `좋아요 ${post.likeCount}`;
        postElement.querySelector(".post-comment-count").textContent = `댓글 ${post.commentCount}`;
        postElement.querySelector(".post-view-count").textContent = `조회수 ${post.viewCount}`;
        postElement.querySelector(".post-created-at").textContent = formatDateTime(post.createdAt);
        setProfileImage(postElement.querySelector(".post-author-img"), post.profileImg);
        postElement.querySelector(".post-author-nickname").textContent = post.nickname;

        postListContainer.appendChild(postElement);
    });
};

const init = async () => {
    const response =  await getPosts();
    renderPosts(response.data.posts);
};

init();
