import {Token, User} from "./types";
import {getCookie, removeCookie, setCookie} from './cookiesManager'
import axiosInstance from "./axiosConfig";

const tryLogin = async (email: string, password: string) => {
    const response = await axiosInstance.post<Token>('/api/v1/auth/authenticate', {email, password});
    setCookie("accessToken", response.data.accessToken, {maxAge: 24 * 60 * 60 * 2});
    setCookie("refreshToken", response.data.refreshToken, {maxAge: 24 * 60 * 60 * 2});
    return await getUser()
}

const tryActivateAccount = async (token: string) => {
    return await axiosInstance.post<Token>('/api/v1/auth/activate-account?token=' + token);
}


const getUserData = async (id: number) => {
    const response = await axiosInstance.get('/api/v1/users/' + id);
    return response.data as User;
}
const getUser = async () => {
    const response = await axiosInstance.get('/api/v1/auth/user');
    return response.data as User
}

const refreshToken = async () => {
    const refreshToken = getCookie("refreshToken")
    if (!refreshToken) return null
    try {
        const response = await axiosInstance.post<Token>('/api/v1/auth/refresh-token', null, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        let newAccessToken = response.headers['authorization'] as string
        newAccessToken = newAccessToken.substring(7)
        setCookie("accessToken", newAccessToken, {maxAge: 60 * 60})
        return newAccessToken
    } catch (error) {
        return null;
    }
}

const tryRegister = async (formData: FormData) => {
    return await axiosInstance.post("/api/v1/auth/register", formData, {
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
const removeCookies = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");
    removeCookie("cart")
}
const tryLogout = () => {
    removeUserFromStorage()
    removeCookies()
    window.location.reload()
};
const placeOrder = async (order: string) => {
    const response = await axiosInstance.post("/api/v1/commerce/purchases", order)
    return response.data
}
export {
    tryLogin,
    tryRegister,
    tryLogout,
    tryActivateAccount,
    refreshToken,
    removeCookies,
    getUser,
    setUserInStorage,
    getUserFromStorage,
    removeUserFromStorage,
    placeOrder,
    getUserData
}