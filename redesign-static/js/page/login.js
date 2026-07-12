import {login} from "../api/user-api.js";

const loginButton = document.getElementById("loginButton");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

function isLoginFormValid() {
    return Boolean(emailInput.value.trim() && emailInput.validity.valid && passwordInput.value);
}

function updateLoginButtonState() {
    loginButton.disabled = !isLoginFormValid();
}

[emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", updateLoginButtonState);
});

updateLoginButtonState();

loginButton.addEventListener("click", async () => {
    updateLoginButtonState();

    if (loginButton.disabled) {
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    const userInfo = {
        email: email,
        password: password
    }

    try{
        const response = await login(userInfo);
        localStorage.setItem("accessToken", response.data.token.accessToken);

        window.location.href = "./index.html"; 
    }catch(error){
        loginError.textContent = "이메일 또는 비밀번호가 올바르지 않습니다.";
        console.error("Error occurred while logging in:", error);
    }
    
    console.log("Login button clicked");
});
