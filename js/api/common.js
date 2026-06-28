const BASE_URL = "http://localhost:8080";

export async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: `GET`,
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || "API 요청 실패");
        error.data = errorData;
        throw error;
    }
    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}
