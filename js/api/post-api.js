import {apiRequest} from "./common.js";

export function getPosts(){
    const response = apiRequest("/posts");
    return response;
}

export function getPostById(postId){
    return apiRequest(`/posts/${postId}`);
}

export function createPost(postData){
    return apiRequest("/posts", {
        method: `POST`,
        body: JSON.stringify(postData)
    });
}

export function updatePost(postId, postData){

    return apiRequest(`/posts/${postId}`,{
        method:`PATCH`,
        body: JSON.stringify(postData)
    });
}

export function deletePost(postId){
    return apiRequest(`/posts/${postId}`,{
        method:`DELETE`
    });
}
