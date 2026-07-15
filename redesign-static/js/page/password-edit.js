import { updatePassword } from "../api/user-api.js"

const passwordSubmitButton = document.getElementById("password-submit-button");
const passwordInput = document.getElementById("password");
const passwordConfirmInput = document.getElementById("password-confirm");
const passwordHelper = document.getElementById("password-error");
const passwordConfirmHelper = document.getElementById("password-confirm-error");
const passwordSuccessToast = document.getElementById("password-success-toast");
const passwordMessageToast = document.getElementById("password-message");
let toastTimerId = null;
let isSubmitting = false;

function showPasswordToast(message) {
    passwordMessageToast.textContent = message;
    passwordSuccessToast.hidden = false;

    if (toastTimerId !== null) {
        clearTimeout(toastTimerId);
    }

    toastTimerId = setTimeout(() => {
        passwordSuccessToast.hidden = true;
        toastTimerId = null;
    }, 2000);
}

function validatePasswordConfirm() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (password && passwordConfirm && password !== passwordConfirm) {
        passwordConfirmHelper.textContent = "* 비밀번호가 일치하지 않습니다.";
        return false;
    }

    passwordConfirmHelper.textContent = "";
    return true;
}

function updatePasswordSubmitButtonState() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    passwordSubmitButton.disabled = !(password && passwordConfirm && password === passwordConfirm) || isSubmitting;
}

[passwordInput, passwordConfirmInput].forEach((input) => {
    input.addEventListener("input", () => {
        validatePasswordConfirm();
        updatePasswordSubmitButtonState();
    });
});

updatePasswordSubmitButtonState();

passwordSubmitButton.addEventListener("click", async () => {

    if(isSubmitting) {
        return;
    }

    updatePasswordSubmitButtonState();
    if (passwordSubmitButton.disabled) {
        return;
    }
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    passwordHelper.textContent = "";
    passwordConfirmHelper.textContent = "";

    if (!password) {
        passwordHelper.textContent = "* 비밀번호를 입력해주세요.";
        passwordInput.focus();
        return;
    }

    if (!passwordConfirm) {
        passwordConfirmHelper.textContent = "* 비밀번호를 한번 더 입력해주세요.";
        passwordConfirmInput.focus();
        return;
    }

    if (password !== passwordConfirm) {
        passwordConfirmHelper.textContent = "* 비밀번호가 일치하지 않습니다.";
        passwordConfirmInput.focus();
        return;
    }

    isSubmitting = true;
    updatePasswordSubmitButtonState();

    try{
        await updatePassword({ password: password });
        showPasswordToast("수정완료");
    }catch(error){
        console.log("변경실패: ",error);
        isSubmitting = false;
        updatePasswordSubmitButtonState();
        showPasswordToast("수정실패");
    }
});
