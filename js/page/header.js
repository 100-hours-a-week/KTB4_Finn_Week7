import {getUserInfo,logout} from "../api/user-api.js";
import { setProfileImage } from "../utils/image.js";

const profileMenuButton = document.getElementById("profile-menu-button");
const profileDropdown = document.getElementById("profile-dropdown");
const logoutButton = document.getElementById("logout-button");
const headerProfileImg = document.getElementById("header-profile-img");

setProfileImage(headerProfileImg);

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

async function renderHeaderProfile() {
    if (!headerProfileImg) {
        return;
    }

    try {
        const response = await getUserInfo();
        const user = response.data;

        setProfileImage(headerProfileImg, user.profileImg);
    } catch (error) {
        console.log("헤더 사용자 정보 요청 실패:", error);
        setProfileImage(headerProfileImg);
    }
}

renderHeaderProfile();
