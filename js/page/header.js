import {logout} from "../api/user-api.js";

const profileMenuButton = document.getElementById("profile-menu-button");
const profileDropdown = document.getElementById("profile-dropdown");
const logoutButton = document.getElementById("logout-button");

if (profileMenuButton && profileDropdown) {
    profileMenuButton.addEventListener("click", (event) => {
        event.stopPropagation();
        profileDropdown.hidden = !profileDropdown.hidden;
    });

    profileDropdown.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("click", () => {
        profileDropdown.hidden = true;
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", async() => {
        try{
            await logout();
            window.location.href = "/html/login.html";
        }catch(error){
            console.log("로그아웃 실패: ", error);
        }
    
    });
}
