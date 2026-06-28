import { getUserInfo, updateUser,withdraw } from "../api/user-api.js"

let userInfo = null;

const profileImg = document.getElementById("profile-preview");
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

nicknameInput.addEventListener("input", updateEditButtonState);
updateEditButtonState();

editButton.addEventListener("click", async () => {
    const profileImgValue = profileImg.src;
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

    const userData = {
        nickname: nickname,
        profileImg: profileImgValue
    }

    try{
        await updateUser(userData);
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
        profileImg.src = userInfo.profileImg;
        email.textContent = userInfo.email;
        nicknameInput.value=userInfo.nickname;
        updateEditButtonState();
    }catch(error){
        console.log("사용자정보 요청 실패: ", error);
    }
}

init();
