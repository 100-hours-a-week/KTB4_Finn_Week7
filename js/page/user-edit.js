import { getUserInfo, updateUser,withdraw } from "../api/user-api.js"
import { registerUserProfile } from "../api/image-api.js";
import { setProfileImage } from "../utils/image.js";

let userInfo = null;

const profileImg = document.getElementById("profile-preview");
const profileImgInput = document.getElementById("profile-image-input");
const email = document.getElementById("user-email");
const nicknameInput = document.getElementById("nickname");
const nicknameHelper = document.getElementById("nickname-error");
const editButton = document.getElementById("edit-submit-button");
const withdrawButton = document.getElementById("withdraw-button");
const withdrawModal = document.getElementById("withdraw-modal");
const withdrawCancelButton = document.getElementById("withdraw-cancel-button");
const withdrawConfirmButton = document.getElementById("withdraw-confirm-button");
const editSuccessToast = document.getElementById("edit-success-toast");
const editMessageToast = document.getElementById("edit-message");
let toastTimerId = null;
let profilePreviewUrl = null;
const MAX_NICKNAME_LENGTH = 10;

function openWithdrawModal() {
    withdrawModal.hidden = false;
}

function closeWithdrawModal() {
    withdrawModal.hidden = true;
}

function showEditToast(message) {
    editMessageToast.textContent = message;
    editSuccessToast.hidden = false;

    if (toastTimerId !== null) {
        clearTimeout(toastTimerId);
    }

    toastTimerId = setTimeout(() => {
        editSuccessToast.hidden = true;
        toastTimerId = null;
    }, 2000);
}

function isUserEditFormValid() {
    const nickname = nicknameInput.value.trim();

    return Boolean(nickname && nickname.length <= MAX_NICKNAME_LENGTH);
}

function updateEditButtonState() {
    const nickname = nicknameInput.value.trim();

    if (nickname.length > MAX_NICKNAME_LENGTH) {
        nicknameHelper.textContent = "닉네임은 최대 10글자까지 가능합니다.";
    } else if (nickname) {
        nicknameHelper.textContent = "";
    }

    editButton.disabled = !isUserEditFormValid();
}

function clearProfilePreviewUrl() {
    if (profilePreviewUrl) {
        URL.revokeObjectURL(profilePreviewUrl);
        profilePreviewUrl = null;
    }
}

async function getUpdatedProfileImg() {
    const file = profileImgInput.files[0];

    if (!file) {
        return userInfo?.profileImg || null;
    }

    const response = await registerUserProfile(file);
    return response.data.imageUrl;
}

function buildUserUpdatePayload(nickname, profileImgValue) {
    return {
        nickname,
        profileImg: profileImgValue
    };
}

function applyUpdatedUser(nickname, profileImgValue) {
    userInfo = {
        ...userInfo,
        nickname,
        profileImg: profileImgValue
    };

    setProfileImage(profileImg, profileImgValue);
    profileImgInput.value = "";
    clearProfilePreviewUrl();
}

nicknameInput.addEventListener("input", updateEditButtonState);

profileImgInput.addEventListener("change", () => {
    const file = profileImgInput.files[0];

    clearProfilePreviewUrl();

    if (!file) {
        setProfileImage(profileImg, userInfo?.profileImg);
        return;
    }

    profilePreviewUrl = URL.createObjectURL(file);
    profileImg.src = profilePreviewUrl;
});

updateEditButtonState();

editButton.addEventListener("click", async () => {
    const nickname = nicknameInput.value.trim();

    updateEditButtonState();

    if (editButton.disabled) {
        return;
    }

    if (!nickname) {
        nicknameHelper.textContent = "* 닉네임을 입력해주세요.";
        nicknameInput.focus();
        return;
    }

    try{
        const profileImgValue = await getUpdatedProfileImg();
        const userData = buildUserUpdatePayload(nickname, profileImgValue);

        await updateUser(userData);
        applyUpdatedUser(nickname, profileImgValue);
        showEditToast("수정완료");

    }catch(error){
        console.log("회원정보수정 실패 : ", error);
        showEditToast("수정실패");
    }

});

withdrawButton.addEventListener("click", () => {
    openWithdrawModal();
});

withdrawCancelButton.addEventListener("click", closeWithdrawModal);

withdrawModal.addEventListener("click", (event) => {
    if (event.target === withdrawModal) {
        closeWithdrawModal();
    }
});

withdrawConfirmButton.addEventListener("click", async() => {
    try{
        await withdraw();
        window.location.href = "/html/login.html";
    }catch(error){
        console.log("탈퇴 실패: ", error);
        closeWithdrawModal();
    }
});

const init = async () => {
    try{
        const response = await getUserInfo();
        userInfo = response.data;

        console.log("userInfo: ", userInfo);
        setProfileImage(profileImg, userInfo.profileImg);
        email.textContent = userInfo.email;
        nicknameInput.value=userInfo.nickname;
        updateEditButtonState();
    }catch(error){
        console.log("사용자정보 요청 실패: ", error);
    }
}

init();
