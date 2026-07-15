// 기록 업로드/수정 화면 전용 스크립트가 필요할 때 이 파일에서 확장합니다.
import { createPost, getPostById, updatePost } from "../api/post-api.js";
import { registerPostImage } from "../api/image-api.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("postId");
const isUpdateMode = postId !== null;

const titleInput = document.getElementById("post-title");
const contentInput = document.getElementById("post-content");
const fileInput = document.getElementById("post-image");
const submitButton = document.getElementById("submit-button");
const uploadLabel = document.getElementById("upload-label");
const imagePreview = document.getElementById("image-preview");
const imagePreviewImg = document.getElementById("image-preview-img");
const imagePreviewName = document.getElementById("image-preview-name");
const imagePreviewDetail = document.getElementById("image-preview-detail");
const imageRemoveButton = document.getElementById("image-remove-button");

const titleHelper = document.getElementById("title-error");
const contentHelper = document.getElementById("content-error");
const imageHelper = document.getElementById("image-error");

const MAX_TITLE_LENGTH = 26;
let previewObjectUrl = null;
let existingImageUrl = null;
let shouldRemoveExistingImage = false;
let isSubmitting = false;


window.addEventListener("beforeunload", releasePreviewObjectUrl);


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

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  imageHelper.textContent = "";

  if (!file) {
    restoreExistingPreviewOrHide();
    return;
  }

  if (!file.type.startsWith("image/")) {
    fileInput.value = "";
    restoreExistingPreviewOrHide();
    imageHelper.textContent = "이미지 파일만 첨부할 수 있어요.";
    return;
  }

  shouldRemoveExistingImage = false;
  showSelectedFilePreview(file);
});

imageRemoveButton.addEventListener("click", () => {
  fileInput.value = "";
  shouldRemoveExistingImage = true;
  imageHelper.textContent = "";
  hideImagePreview();
});

submitButton.addEventListener("click", async () => {

  if (isSubmitting) {
    return;
  }

  updateSubmitButtonState();

  if (submitButton.disabled) {
    return;
  }

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

  isSubmitting = true;
  updateSubmitButtonState();

  let contentImg = shouldRemoveExistingImage ? null : existingImageUrl;

  try {
    const uploadedImageUrl = await uploadPostImageIfSelected();
    if (uploadedImageUrl) {
      contentImg = uploadedImageUrl;
    }
  } catch (error) {
    isSubmitting = false;
    updateSubmitButtonState();
    console.log("이미지등록 실패: ", error);
    return;
  }

  const postData = {
    title,
    content,
    contentImg
  };

  try {
    let detailPostId = postId;
    if(isUpdateMode){
        const response = await updatePost(postId, postData);
      }else{
        const result = await createPost(postData);
        detailPostId = result.data.id;
      } 
      window.location.href = "/redesign-static/html/post-detail.html?postId=" + detailPostId;
    } catch (error) {
      isSubmitting = false;
      updateSubmitButtonState();
      console.log(isUpdateMode ? "게시물 수정 실패: " : "게시물 생성 실패: ", error);
    }

});


function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function releasePreviewObjectUrl() {
  if (!previewObjectUrl) {
    return;
  }

  URL.revokeObjectURL(previewObjectUrl);
  previewObjectUrl = null;
}

function showImagePreview({ src, name, detail }) {
  imagePreviewImg.src = src;
  imagePreviewName.textContent = name;
  imagePreviewDetail.textContent = detail;
  imagePreview.hidden = false;
  uploadLabel.textContent = "사진 변경";
}

function hideImagePreview() {
  releasePreviewObjectUrl();
  imagePreviewImg.removeAttribute("src");
  imagePreviewName.textContent = "";
  imagePreview.hidden = true;
  uploadLabel.textContent = "＋ 사진을 첨부하세요";
}

function showSelectedFilePreview(file) {
  releasePreviewObjectUrl();
  previewObjectUrl = URL.createObjectURL(file);
  showImagePreview({
    src: previewObjectUrl,
    name: file.name,
    detail: `선택한 사진 · ${formatFileSize(file.size)}`
  });
}

function restoreExistingPreviewOrHide() {
  if (existingImageUrl && !shouldRemoveExistingImage) {
    releasePreviewObjectUrl();
    showImagePreview({
      src: existingImageUrl,
      name: "현재 게시물 이미지",
      detail: "기존에 첨부된 사진"
    });
    return;
  }

  hideImagePreview();
}

function isPostFormValid() {
  return Boolean(titleInput.value.trim() && contentInput.value.trim());
}

function updateSubmitButtonState() {
  const isValid = isPostFormValid();

  const shouldDisable = !isValid || isSubmitting;

  submitButton.disabled = shouldDisable;
  submitButton.classList.toggle("is-disabled", shouldDisable);
  submitButton.setAttribute("aria-disabled", String(shouldDisable));
}


async function uploadPostImageIfSelected() {
  const file = fileInput.files[0];

  if (!file) {
    return null;
  }

  const response = await registerPostImage(file);
  return response.data.imageUrl;
}


updateSubmitButtonState();


function limitTitleLength() {
  if (titleInput.value.length > MAX_TITLE_LENGTH) {
    titleInput.value = titleInput.value.slice(0, MAX_TITLE_LENGTH);
  }
}




const init = async () => {
  if (!isUpdateMode) {
    return;
  }

  try {
    const response = await getPostById(postId);
    const post = response.data;

    titleInput.value = post.title;
    contentInput.value = post.content;
    existingImageUrl = post.contentImg || null;

    if (existingImageUrl) {
      showImagePreview({
        src: existingImageUrl,
        name: "현재 게시물 이미지",
        detail: "기존에 첨부된 사진"
      });
    }

    updateSubmitButtonState();
  } catch (error) {
    console.log("게시물 정보 요청 실패: ", error);
  }
};



init();
