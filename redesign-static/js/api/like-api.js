import {apiRequest} from "./common.js";

export function likePost(postId){
    return apiRequest(`/posts/${postId}/like`, {
        method: `POST`
    });
}

export function unlikePost(postId){
    return apiRequest(`/posts/${postId}/like`, {
        method: `DELETE`
    });
}