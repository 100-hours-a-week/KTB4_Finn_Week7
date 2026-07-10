const BASE_URL = "http://localhost:8080";

let refreshTokenPromise = null;


function refreshAccessToken(){
    if(!refreshTokenPromise){
        refreshTokenPromise = fetch(`${BASE_URL}/users/token/refresh`,{
            method: "POST",
            credentials: "include",
        })
        .then(async (res) => {
             if(!res.ok){
                localStorage.removeItem("accessToken");
                throw new Error("Failed to refresh access token");
            }
            return res.json();
        })
        .then((body) => {
            const newAccessToken = body.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            console.log("Refreshed access token:", newAccessToken);
            return newAccessToken;
        })
        .finally(() => {
            refreshTokenPromise = null;
        });
    }

    return refreshTokenPromise;
}


export async function apiRequest(endpoint, options = {}, retry = true) {
    const isFormData = options.body instanceof FormData;


    const accessToken = localStorage.getItem("accessToken");

    const headers = {
        ...(options.headers || {}),
    };

    if(!isFormData && !headers["Content-Type"]){
        headers["Content-Type"] = "application/json";
    }
    if(accessToken){
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: `GET`,
        ...options,
        credentials: "include",
        headers,
    });

    if((response.status === 401 || response.status === 403) && retry){
        await refreshAccessToken();
        return apiRequest(endpoint, options, false);
    }


    if (!response.ok) {
        const errorText = await response.text();
        let errorData = {};

        try {
            errorData = errorText ? JSON.parse(errorText) : {};
        } catch {
            errorData = { message: errorText };
        }

        const error = new Error(errorData.message || "API 요청 실패");
        error.status = response.status;
        error.data = errorData;
        throw error;
    }
    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}
