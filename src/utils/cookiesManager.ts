import Cookies from 'universal-cookie';

const cookies: Cookies = new Cookies();

export const setCookie = (name: string, value: string) => {
    cookies.set(name, value);
}

export const getCookie = (name: string): string | undefined => {
    return cookies.get(name);
}

export const removeCookie = (name: string) => {
    cookies.remove(name);
}