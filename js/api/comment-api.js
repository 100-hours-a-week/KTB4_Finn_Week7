import { apiRequest } from "./common.js";

export function getCommentByPostId(postId){
    return apiRequest(`/posts/${postId}/comments`);
}

export function registerComment(commentInfo){
    const contentInfo = {
        comment : commentInfo.content
    }
    return apiRequest(`/posts/${commentInfo.postId}/comments`,{
        method: `POST`,
        body: JSON.stringify(contentInfo)
    });
}

export function updateComment(commentInfo){
    const contentInfo = {
        comment : commentInfo.content
    }
    return apiRequest(`/comments/${commentInfo.commentId}`,{
        method: `PATCH`,
        body: JSON.stringify(contentInfo)
    });
}

export function deleteComment(commentId){
    return apiRequest(`/comments/${commentId}`,{
        method: `DELETE`
    });
}