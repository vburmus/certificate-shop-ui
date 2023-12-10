import axiosInstance from "./axiosConfig";

export const getOrders = async (page: number, size: number) => {
    const response = await axiosInstance.get(`/api/v1/commerce/purchases?page=${page - 1}&size=${size}&sort=createDate,desc`)
    return response.data
}

export const getUserOrders = async (userId: number, page: number, size: number) => {
    const response = await axiosInstance.get("/api/v1/commerce/purchases/user/" + userId + `?page=${page - 1}&size=${size}&sort=createDate,desc`)
    return response.data
}