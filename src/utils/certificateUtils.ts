import axiosInstance from "./axiosConfig";
import {Certificate, FilterState, Sort} from "./types";
import {NAME_ASC} from "./constants";

const getCertificateById = async (id: number): Promise<Certificate> => {
    const response = await axiosInstance.get(`/certificate/${id}`)
    return response.data as Certificate
}

function getDateDiffInDays(date: string) {
    return Math.floor((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const getCertificates = async (filterState:FilterState,currentPage:number,currentSize:number,sortState?:Sort,) => {
    if(!sortState){
        sortState ={
            sortDate: "",
            sortName:NAME_ASC
        }
    }
    let query;
    let byPart = `part=${filterState.input.replace(/\s/, "")}`
    let byTags = `tagsId=${filterState.tags.join(",")}`
    if (filterState.tags.length && filterState.input.length) {
        query = `/certificate/search/by-tags-and-part?${byTags}&${byPart}&`;
    } else if (filterState.tags.length) {
        query = `/certificate/search/by-tags?${byTags}&`;
    } else if (filterState.input.length) {
        query = `/certificate/search/by-part-name-description?${byPart}&`
    } else if (sortState.sortName || sortState.sortDate){
        query = `/certificate/sort?sort=`;
        if(sortState.sortDate && sortState.sortName)
            query+=sortState.sortDate + "," + sortState.sortName
        else
            query+= sortState.sortDate.length? sortState.sortDate:sortState.sortName
        query+="&"
    }else{
        query = "/certificate?"
    }
    const response = await axiosInstance.get(query + `page=${currentPage}&size=${currentSize}`);
    return response.data;
}

const updateCertificate = async (id:number,formData:FormData) => {
    const response = await axiosInstance.patch(`/certificate/${id}`,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
const deleteCertificate = async (id:number) => {
     await axiosInstance.delete(`/certificate/${id}`)
}
const createCertificate= async (formData:FormData) => {
    const response = await axiosInstance.post(`/certificate`,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
export {getCertificateById, getDateDiffInDays, getCertificates,updateCertificate,deleteCertificate,createCertificate}