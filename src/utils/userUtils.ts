import {Token, User} from "./types";
import {setCookie, getCookie, removeCookie} from './cookiesManager'
import axiosInstance from "./axiosConfig";

const tryLogin = async (email: string, password: string) => {
    const response = await axiosInstance.post<Token>('/auth/authenticate', {email, password});
    setCookie("accessToken", response.data.token.accessToken);
    setCookie("refreshToken", response.data.token.refreshToken);
    return await getUser(response.data.token.userId)
}


const getUser = async (id: number) => {
    const response = await axiosInstance.get('/user/' + id);
    return response.data;
}

const refreshToken = async () => {
    const refreshToken = getCookie("refreshToken")
    if (!refreshToken) return null
    try {
        const response = await axiosInstance.post<Token>('/auth/refresh-token', null, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        let newAccessToken = response.headers['authorization'] as string
        newAccessToken = newAccessToken.substring(7)
        setCookie("accessToken", newAccessToken)
        return newAccessToken
    } catch (error) {
        return null;
    }
}

const tryRegister = async (formData: FormData) => {
    return await axiosInstance.post("/auth/register", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const setUserInStorage = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
}
const removeUserFromStorage = () => {
    if (localStorage.getItem("user")) {
        localStorage.removeItem("user")
    }
}
const getUserFromStorage = () => {
    const userJSON = localStorage.getItem("user")
    if (userJSON)
        return JSON.parse(userJSON) as User
    return null;
}
const removeAuthCookies = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");
}
const placeOrder = async (order:string) => {
    const response = await axiosInstance.post("/user/create-order",order)
    return response.data
}
export {tryLogin, tryRegister, refreshToken, removeAuthCookies,getUser, setUserInStorage,getUserFromStorage,removeUserFromStorage,placeOrder}