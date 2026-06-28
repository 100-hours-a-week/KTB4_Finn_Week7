const BASE_URL = "http://localhost:8080";

export async function apiRequest(endpoint, options = {}) {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: `GET`,
        ...options,
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        },
    });

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
