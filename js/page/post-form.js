// 게시글 작성/수정 화면 전용 스크립트가 필요할 때 이 파일에서 확장합니다.
import { createPost, getPostById, updatePost } from "../api/post-api.js";
import { registerPostImage } from "../api/image-api.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("postId");
const isUpdateMode = postId !== null;

const titleInput = document.getElementById("post-title");
const contentInput = document.getElementById("post-content");
const fileInput = document.getElementById("post-image");
const submitButton = document.getElementById("submit-button");

const titleHelper = document.getElementById("title-error");
const contentHelper = document.getElementById("content-error");

const MAX_TITLE_LENGTH = 26;

function isPostFormValid() {
  return Boolean(titleInput.value.trim() && contentInput.value.trim());
}

function updateSubmitButtonState() {
  const isValid = isPostFormValid();

  submitButton.classList.toggle("is-disabled", !isValid);
  submitButton.setAttribute("aria-disabled", String(!isValid));
}

function limitTitleLength() {
  if (titleInput.value.length > MAX_TITLE_LENGTH) {
    titleInput.value = titleInput.value.slice(0, MAX_TITLE_LENGTH);
  }
}

async function uploadPostImageIfSelected() {
  const file = fileInput.files[0];

  if (!file) {
    return null;
  }

  const response = await registerPostImage(file);
  return response.data.imageUrl;
}

titleInput.addEventListener("input", () => {
  limitTitleLength();

  if (titleInput.value.trim()) {
    titleHelper.textContent = "";
  }

  updateSubmitButtonState();
});

contentInput.addEventListener("input", () => {
  if (contentInput.value.trim()) {
    contentHelper.textContent = "";
  }

  updateSubmitButtonState();
});

updateSubmitButtonState();

submitButton.addEventListener("click", async () => {
  updateSubmitButtonState();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  let isValid = true;

  if (!title && !content) {
    titleHelper.textContent = "";
    contentHelper.textContent = "제목, 내용 모두 작성해주세요.";
    titleInput.focus();
    return;
  }

  if (!title) {
    titleHelper.textContent = "* 제목을 입력해주세요.";
    isValid = false;
  }

  if (!content) {
    contentHelper.textContent = "* 내용을 입력해주세요.";
    isValid = false;
  }

  if (!isValid) {
    if (!title) {
      titleInput.focus();
    } else {
      contentInput.focus();
    }

    return;
  }

  let contentImg = null;

  try {
    contentImg = await uploadPostImageIfSelected();
  } catch (error) {
    console.log("이미지등록 실패: ", error);
    return;
  }

  const postData = {
    title,
    content,
    contentImg
  };

  if (isUpdateMode) {
    try {
      const response = await updatePost(postId, postData);
      const updatedPost = response.data;

      window.location.href = "/html/post-detail.html?postId=" + updatedPost.id;
    } catch (error) {
      console.log("게시물 수정 실패: ", error);
    }

    return;
  }

  try {
    const result = await createPost(postData);
    const newPost = result.data;

    window.location.href = "/html/post-detail.html?postId=" + newPost.id;
  } catch (error) {
    console.error("Error creating post:", error);
  }
});

const init = async () => {
  if (!isUpdateMode) {
    return;
  }

  try {
    const response = await getPostById(postId);
    const post = response.data;

    titleInput.value = post.title;
    contentInput.value = post.content;
    updateSubmitButtonState();
  } catch (error) {
    console.log("게시물 정보 요청 실패: ", error);
  }
};

init();
