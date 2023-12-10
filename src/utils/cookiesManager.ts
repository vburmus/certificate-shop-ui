import Cookies from 'universal-cookie';

const cookies: Cookies = new Cookies();

export const setCookie = (name: string, value: string, options = {}) => {
    cookies.set(name, value, options);
}

export const getCookie = (name: string) => {
    return cookies.get(name);
}

export const removeCookie = (name: string) => {
    cookies.remove(name);
}