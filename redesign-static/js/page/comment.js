import { registerComment, getCommentByPostId, updateComment, deleteComment } from "../api/comment-api.js";
import { formatDateTime } from "../utils/date-format.js";
import { setProfileImage } from "../utils/image.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("postId");

const commentListContainer = document.getElementById("comment-list-container");
const commentListTemplate = document.getElementById("comment-template");
const commentDeleteModal = document.getElementById("comment-delete-modal");
const commentDeleteCancelButton = document.getElementById("comment-delete-cancel-button");
const commentDeleteConfirmButton = document.getElementById("comment-delete-confirm-button");
const commentInput = document.getElementById("comment-input");
const commentSubmitButton = document.getElementById("comment-submit-button");
let selectedDeleteCommentId = null;
let isSubmitting = false;

function updateCommentSubmitButtonState() {
    commentSubmitButton.disabled = !commentInput.value.trim() || isSubmitting;
}

commentInput.addEventListener("input", updateCommentSubmitButtonState);
updateCommentSubmitButtonState();

commentSubmitButton.addEventListener("click", async () => {
    if(isSubmitting) {
        return;
    }

    const comment = commentInput.value.trim();

    if (!comment) {
        updateCommentSubmitButtonState();
        return;
    }

    const commentInfo = {
        postId : postId,
        content : comment
    }

    isSubmitting = true;
    updateCommentSubmitButtonState();
    try{
        const response = await registerComment(commentInfo);
        window.location.href="/redesign-static/html/post-detail.html?postId="+postId;
    }catch(error){
        isSubmitting = false;
        updateCommentSubmitButtonState();
        console.log("error : ", error)
    }

});

function openDeleteModal(commentId) {
    selectedDeleteCommentId = commentId;
    commentDeleteModal.hidden = false;
}

function closeDeleteModal() {
    selectedDeleteCommentId = null;
    commentDeleteModal.hidden = true;
}

commentDeleteCancelButton.addEventListener("click", closeDeleteModal);

commentDeleteModal.addEventListener("click", (event) => {
    if (event.target === commentDeleteModal) {
        closeDeleteModal();
    }
});

commentDeleteConfirmButton.addEventListener("click", async () => {
    if (selectedDeleteCommentId === null) {
        return;
    }
    try {
        await deleteComment(selectedDeleteCommentId);
        window.location.href = "/redesign-static/html/post-detail.html?postId=" + postId;
    } catch (error) {
        console.log("댓글 삭제 실패: ", error);
        closeDeleteModal();
    }
});

function renderCommentList(comments) {
  commentListContainer.innerHTML = "";

  comments.forEach((comment) => {
    const commentElement = commentListTemplate.content.cloneNode(true);

    setProfileImage(commentElement.querySelector(".comment-author-img"), comment.profileImg);
    commentElement.querySelector(".comment-author").textContent = comment.nickname;
    commentElement.querySelector(".comment-created-at").textContent = formatDateTime(comment.createdAt);
    commentElement.querySelector(".comment-content").textContent = comment.content;

    const commentActions = commentElement.querySelector(".comment-actions");
    const editButton = commentElement.querySelector(".comment-edit-button");
    const deleteButton = commentElement.querySelector(".comment-delete-button");
    const commentContent = commentElement.querySelector(".comment-content");
    const editBox = commentElement.querySelector(".comment-edit-box");
    const editInput = commentElement.querySelector(".comment-edit-input");
    const cancelButton = commentElement.querySelector(".comment-edit-cancel-button");
    const submitButton = commentElement.querySelector(".comment-edit-submit-button");

    function updateEditSubmitButtonState() {
      submitButton.disabled = !editInput.value.trim();
    }

    commentActions.style.display = comment.isMine ? "flex" : "none";

    editButton.addEventListener("click", () => {
      editInput.value = comment.content;
      editBox.hidden = false;
      commentContent.style.display = "none";
      updateEditSubmitButtonState();
    });

    editInput.addEventListener("input", updateEditSubmitButtonState);

    deleteButton.addEventListener("click", () => {
        openDeleteModal(comment.id);
    });

    cancelButton.addEventListener("click", () => {
      editBox.hidden = true;
      commentContent.style.display = "block";
    });

    submitButton.addEventListener("click", async () => {
      const newContent = editInput.value.trim();

      if (!newContent) {
        updateEditSubmitButtonState();
        return;
      }

      const commentInfo = {
        commentId: comment.id,
        content: newContent
      }

      try{
          const response = await updateComment(commentInfo);
          console.log("댓글 수정 성공: ",response);
          commentContent.textContent = newContent;
          comment.content = newContent;
          editBox.hidden = true;
          commentContent.style.display = "block";
      }catch(error){
          console.log("댓글 수정 실패: ", error);
      }
      
    });

    commentListContainer.appendChild(commentElement);
  });
}
const init = async () => {

   const response = await getCommentByPostId(postId);
   const comments = response.data.comments;

   renderCommentList(comments);

};

init();
