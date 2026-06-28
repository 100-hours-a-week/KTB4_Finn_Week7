// 회원가입 화면 전용 스크립트가 필요할 때 이 파일에서 확장합니다.
import {signup} from "../api/user-api.js";

const signupButton = document.getElementById("signup-button");
const nicknameInput = document.getElementById("nickname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordCheckInput = document.getElementById("password-check");
const emailError = document.getElementById("email-error");
const passwordCheckError = document.getElementById("password-check-error");
const nicknameError = document.getElementById("nickname-error");

const MAX_NICKNAME_LENGTH = 10;

function isSignupFormValid() {
    const nickname = nicknameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;

    return Boolean(
        nickname &&
        nickname.length <= MAX_NICKNAME_LENGTH &&
        email &&
        password &&
        passwordCheck &&
        password === passwordCheck
    );
}

function updateSignupButtonState() {
    const nickname = nicknameInput.value.trim();
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;
    const isNicknameTooLong = nickname.length > MAX_NICKNAME_LENGTH;
    const isPasswordMismatch = passwordCheck && password !== passwordCheck;

    nicknameError.textContent = isNicknameTooLong ? "닉네임은 최대 10글자까지 가능합니다." : "";
    passwordCheckError.textContent = isPasswordMismatch ? "비밀번호가 일치하지 않습니다." : "";
    signupButton.disabled = !isSignupFormValid();
}

[nicknameInput, passwordInput, passwordCheckInput].forEach((input) => {
    input.addEventListener("input", updateSignupButtonState);
});

emailInput.addEventListener("input", () => {
    emailError.textContent = "";
    updateSignupButtonState();
});

updateSignupButtonState();

function normalizeErrorCode(code) {
    if (!code) {
        return "";
    }

    return String(code).trim().toUpperCase();
}

function isEmailDuplicateError(error) {
    const errorData = error.data || {};
    const code = normalizeErrorCode(errorData.code || errorData.errorCode || errorData.type);
    const field = String(errorData.field || "").toLowerCase();
    const serverText = `${JSON.stringify(errorData)} ${error.message || ""}`.toLowerCase();

    return (
        field === "email" ||
        code.includes("EMAIL_DUPLICATE") ||
        code.includes("DUPLICATE_EMAIL") ||
        code.includes("EMAIL_ALREADY_EXISTS") ||
        serverText.includes("email") ||
        serverText.includes("이메일")
    ) && (
        code.includes("DUPLICATE") ||
        code.includes("ALREADY_EXISTS") ||
        serverText.includes("duplicate") ||
        serverText.includes("already") ||
        serverText.includes("중복") ||
        serverText.includes("이미")
    );
}

signupButton.addEventListener("click", async () => {
    updateSignupButtonState();

    if (signupButton.disabled) {
        return;
    }

    const userData = {
        nickname: nicknameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value
    };

    try {
        emailError.textContent = "";
        await signup(userData);
        location.href = "./login.html";
    } catch (error) {
        if (isEmailDuplicateError(error)) {
            emailError.textContent = "이미 사용 중인 이메일입니다.";
        }

        console.error("Error occurred while signing up:", error);
    }

    console.log("signup button clicked");
});
