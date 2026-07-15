import {login} from "../api/user-api.js";

const loginButton = document.getElementById("loginButton");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

let isSubmitting = false;

function isLoginFormValid() {
    return Boolean(emailInput.value.trim() && emailInput.validity.valid && passwordInput.value);
}

function updateLoginButtonState() {
    loginButton.disabled = !isLoginFormValid() || isSubmitting;
}

[emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", updateLoginButtonState);
});

updateLoginButtonState();

loginButton.addEventListener("click", async () => {
    if (isSubmitting) {
        return;
    }

    if (loginButton.disabled) {
        return;
    }

    isSubmitting = true;
    updateLoginButtonState();
    
    const userInfo = {
        email: emailInput.value.trim(),
        password: passwordInput.value
    }

    try{
        const response = await login(userInfo);
        localStorage.setItem("accessToken", response.data.token.accessToken);

        window.location.href = "./index.html"; 
    }catch(error){
        loginError.textContent = "이메일 또는 비밀번호가 올바르지 않습니다.";
        console.error("Error occurred while logging in:", error);
        isSubmitting = false;
        updateLoginButtonState();
    }
    
    console.log("Login button clicked");
});
