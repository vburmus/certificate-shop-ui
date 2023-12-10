import axiosInstance from "./axiosConfig";

interface SearchTagsProps {
    inputValue?: string | undefined,
    tagPage?: number | undefined,
    currentSize: number
}

const getTags = async (search: SearchTagsProps) => {
    const {inputValue, tagPage, currentSize} = search
    let query;
    if (inputValue && tagPage) {
        query = `api/v1/commerce/tags/search/by-name-part?page=${tagPage - 1}&size=${currentSize}&part=${inputValue}`
    } else if (inputValue) {
        query = `api/v1/commerce/tags/search/by-name-part?page=0&size=${currentSize}&part=${inputValue}`
    } else if (tagPage) {
        query = `api/v1/commerce/tags?page=${tagPage - 1}&size=${currentSize}&sort=name`
    } else {
        query = `api/v1/commerce/tags?page=0&size=${currentSize}&sort=name`
    }

    const response = await axiosInstance.get(query);
    return response.data;
}
const createTag = async (formData: FormData) => {
    const response = await axiosInstance.post("/api/v1/commerce/tags", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}
const updateTag = async (id: number, formData: FormData) => {
    const response = await axiosInstance.patch(`/api/v1/commerce/tags/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
const deleteTag = async (id: number) => {
    await axiosInstance.delete(`/api/v1/commerce/tags/${id}`)
}
const getTagsByNamePart = async (part: string) => {
    const response = await axiosInstance.get(`/api/v1/commerce/tags/search/by-name-part?part=${part}`)
    return response.data
}
export {createTag, getTags, updateTag, deleteTag, getTagsByNamePart}