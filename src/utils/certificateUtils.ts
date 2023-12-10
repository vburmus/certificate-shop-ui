import axiosInstance from "./axiosConfig";
import {Certificate, FilterState, Sort} from "./types";

const getCertificateById = async (id: number): Promise<Certificate> => {
    const response = await axiosInstance.get(`/api/v1/commerce/certificates/${id}`)
    return response.data as Certificate
}

function getDateDiffInDays(date: string) {
    return Math.floor((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const getCertificates = async (filterState: FilterState, currentPage: number, currentSize: number, sortState?: Sort,) => {
    if (!sortState) {
        sortState = {
            sortDate: "durationDate,desc",
            sortName: ""
        }
    }
    let query;
    let byPart = `part=${filterState.input.replace(/\s/, "")}`
    let byTags = `tagIds=${filterState.tags.join(",")}`
    if (filterState.tags.length && filterState.input.length) {
        query = `/api/v1/commerce/certificates/search/by-tags-and-part?${byTags}&${byPart}&`;
    } else if (filterState.tags.length) {
        query = `/api/v1/commerce/certificates/search/by-tags?${byTags}&`;
    } else if (filterState.input.length) {
        query = `/api/v1/commerce/certificates/search/by-name-or-description-part?${byPart}&`
    } else if (sortState.sortName || sortState.sortDate) {
        query = `/api/v1/commerce/certificates?sort=`;
        if (sortState.sortDate && sortState.sortName)
            query += sortState.sortDate + "," + sortState.sortName
        else
            query += sortState.sortDate.length ? sortState.sortDate : sortState.sortName
        query += "&"
    } else {
        query = "/api/v1/commerce/certificates?"
    }
    const response = await axiosInstance.get(query + `page=${currentPage - 1}&size=${currentSize}`);
    return response.data;
}

const updateCertificate = async (id: number, formData: FormData) => {
    const response = await axiosInstance.patch(`/api/v1/commerce/certificates/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
const deleteCertificate = async (id: number) => {
    await axiosInstance.delete(`/api/v1/commerce/certificates/${id}`)
}
const createCertificate = async (formData: FormData) => {
    const response = await axiosInstance.post(`/api/v1/commerce/certificates`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
export {getCertificateById, getDateDiffInDays, getCertificates, updateCertificate, deleteCertificate, createCertificate}