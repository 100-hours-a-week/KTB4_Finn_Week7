
import {deletePost, getPostById} from "../api/post-api.js";
import {likePost, unlikePost} from "../api/like-api.js";
import { formatDateTime } from "../utils/date-format.js";
import { setOptionalImage, setProfileImage } from "../utils/image.js";


const params = new URLSearchParams(window.location.search);
const postId = params.get("postId");

const likeButton = document.getElementById("post-like-button");
const likeCount = document.getElementById("like-count");
const postDeleteModal = document.getElementById("post-delete-modal");
const postDeleteCancelButton = document.getElementById("post-delete-cancel-button");
const postDeleteConfirmButton = document.getElementById("post-delete-confirm-button");


let isLiked = null;

function renderLikeState(isLiked) {
    likeButton.classList.toggle("is-liked", isLiked);
    likeButton.setAttribute("aria-pressed", String(isLiked));

    const likeIcon = likeButton.querySelector(".like-icon");
    if (likeIcon) {
        likeIcon.textContent = isLiked ? "♥" : "♡";
    }
}

function openPostDeleteModal() {
    postDeleteModal.hidden = false;
}

function closePostDeleteModal() {
    postDeleteModal.hidden = true;
}



document.getElementById("post-edit-button").addEventListener("click", () => {
    window.location.href="/redesign-static/html/post-update.html?postId="+postId;
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
        window.location.href = "/redesign-static/html/index.html";
    } catch (error) {
        console.error("Error deleting post:", error);
        closePostDeleteModal();
    }
});

likeButton.addEventListener("click", async () => {

    likeButton.disabled = true;
    try {
        let response;
        if(isLiked){
            response = await unlikePost(postId);
            
        }else{
            response = await likePost(postId);
        }
        console.log("like response:", response.data);
        isLiked = response.data.isLiked;
        likeCount.textContent = response.data.likeCount;
        renderLikeState(isLiked);
    }
     catch (error) {
        console.error("Error toggling like:", error);
    }finally{
        likeButton.disabled = false;
    }
});


function renderPostDetail(post) {
    const authorName =
      post.username ||
      "알 수 없는 사용자";

    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-content").textContent = post.content;
    document.getElementById("post-created-at").textContent = formatDateTime(post.createdAt);
    likeCount.textContent = post.likeCount;
    document.getElementById("comment-count").textContent = post.commentCount;
    document.getElementById("view-count").textContent = post.viewCount;
    setOptionalImage(document.getElementById("post-image"), post.contentImg);
    

    document.getElementById("post-edit-button").style.display = post.isMine ? "inline-block" : "none";
    document.getElementById("post-delete-button").style.display = post.isMine ? "inline-block" : "none";


    
    document.getElementById("post-author").textContent = authorName;
    setProfileImage(document.getElementById("post-author-img"), post.profileImg);

    isLiked = post.like !== null;
    
    renderLikeState(isLiked);

}


const init = async () => {

    try{
        const response = await getPostById(postId);
        const postInfo = response.data;
        renderPostDetail(postInfo);
    }catch(error){
        console.log(error);
    }
   

};


init();
