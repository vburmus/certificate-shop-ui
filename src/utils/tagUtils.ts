import axiosInstance from "./axiosConfig";

const getTags = async (query: string) => {
    const response = await axiosInstance.get(query);
    return response.data;
}
const createTag = async (formData:FormData) => {
    const response = await axiosInstance.post("/tag", formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}
const getTagsByNamePart = async(part:string) => {
    const response = await axiosInstance.get(`/tag/search/by-name-part?part=${part}`)
    return response.data
}
export {getTags,createTag,getTagsByNamePart}