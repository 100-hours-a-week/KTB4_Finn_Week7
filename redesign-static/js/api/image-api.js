import {apiRequest} from "./common.js";



export function registerPostImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest(`/images/posts`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
}

export function registerUserProfile(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest(`/images/users`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
}

