import {getCookie, setCookie} from "./cookiesManager";
import {CartPosition} from "./types";

export const getCartPositionsFromCookies = (): CartPosition[] => {
    const cart: CartPosition[] = []
    const cartCookie = getCookie("cart");
    if (cartCookie && Array.isArray(cartCookie.positions)) {
        cartCookie.positions.map((position: CartPosition) => cart.push(position))
    }
    return cart;

};

export const setCartPositionsToCookies = (positions: CartPosition[]) => {
    setCookie("cart", JSON.stringify({positions}), {maxAge: 24 * 60 * 60 * 7});
};

export const addPosition = (position: CartPosition) => {
    const positions = getCartPositionsFromCookies();
    positions.push(position);
    setCartPositionsToCookies(positions);
};

export const removePosition = (id: number) => {
    let positions = getCartPositionsFromCookies();
    positions = positions.filter((position) => position.certificateId !== id);
    setCartPositionsToCookies(positions);
};

export const updatePositionQuantity = (id: number | undefined, quantity: number) => {
    let positions = getCartPositionsFromCookies();
    positions = positions.map((position) =>
        position.certificateId === id ? {...position, quantity: quantity} : position
    );
    setCartPositionsToCookies(positions);
};

export const getPositionByCertificateId = (id: number): CartPosition | undefined => {
    const positions = getCartPositionsFromCookies();
    return positions.find((position) => position.certificateId === id);
};