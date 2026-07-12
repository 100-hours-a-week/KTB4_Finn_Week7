import {apiRequest} from './common.js';

export function login(userInfo){
    return apiRequest('/users/login', {
        method: 'POST',
        body: JSON.stringify(userInfo)
    });
}
export function logout(){
    return apiRequest(`/users/logout`,{
        method: `POST`
    });
}

export function signup(userData){
    return apiRequest('/users/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

export function getUserInfo(){
    return apiRequest(`/users/me`);
}

export function updateUser(userData){
    return apiRequest(`/users/me`,{
        method: `PATCH`,
        body: JSON.stringify(userData)  
    });
}

export function updatePassword(passwordData){
    return apiRequest(`/users/me/password`,{
        method: `PATCH`,
        body: JSON.stringify(passwordData)
    });
}

export function withdraw(){
    return apiRequest(`/users/me`,{
        method: `DELETE`
    });
}
