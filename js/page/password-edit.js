import { updatePassword } from "../api/user-api.js"

const passwordSubmitButton = document.getElementById("password-submit-button");
const passwordInput = document.getElementById("password");
const passwordConfirmInput = document.getElementById("password-confirm");
const passwordHelper = document.getElementById("password-error");
const passwordConfirmHelper = document.getElementById("password-confirm-error");
const passwordSuccessToast = document.getElementById("password-success-toast");
const passwordMessageToast = document.getElementById("password-message");
let toastTimerId = null;

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

passwordInput.addEventListener("input", validatePasswordConfirm);
passwordConfirmInput.addEventListener("input", validatePasswordConfirm);

passwordSubmitButton.addEventListener("click", async () => {
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

    try{
        await updatePassword({ password: password });
        showPasswordToast("수정완료");
    }catch(error){
        console.log("변경실패: ",error);
        showPasswordToast("수정실패");
    }
});
