import React, {useEffect, useState} from 'react';
import PaginationList from "./PaginationList";
import {useLocation} from "react-router-dom";
import {Certificate, Sort} from "../../utils/types";
import CertificatesTable from "./CertificatesTable";
import {getCertificates} from "../../utils/certificateUtils";
import {isAxiosError} from "axios";
import Loader from "../common/Loader";
import {useSelector} from "react-redux";
import RootState from "../../redux/RootState";
import {
    ASC,
    CHANGE_THE_CRITERIA,
    DATE_ASC,
    DATE_DESC,
    DESC,
    NAME_ASC,
    NAME_DESC,
    PAGE,
    SIZE,
    SORT,
    WRONG_NUMBER_OF_SORT_PARAMS,
    WRONG_SORT_DIRECTION,
    WRONG_SORT_PARAM,
    WRONG_SORT_PARAMS
} from '../../utils/constants';


const AdminUI = () => {
    const [error, setError] = useState('')
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get(PAGE);
    let currentPage = page ? parseInt(page) : 1
    const size = queryParams.get(SIZE);
    const currentSize = size ? parseInt(size) : 5
    const sortParams = queryParams.getAll(SORT)
    const filterState = useSelector((state: RootState) => state.filter)
    const parseSort = () => {
        const sort: Sort = {
            sortDate: "",
            sortName: ""
        }
        if (sortParams.length === 2) {
            const date = sortParams[0].split(":")
            const name = sortParams[1].split(":")
            if (date[0] === DATE_ASC) {
                if (date[1] === DESC)
                    sort.sortDate = DATE_DESC
                else if (date[1] === ASC)
                    sort.sortDate = DATE_ASC
                else
                    setError(WRONG_SORT_DIRECTION)
            } else if (name[0] === NAME_ASC) {
                if (name[1] === DESC)
                    sort.sortName = NAME_DESC
                else if (name[1] === ASC)
                    sort.sortName = NAME_ASC
                else
                    setError(WRONG_SORT_DIRECTION)
            } else {
                setError(WRONG_SORT_PARAMS)
            }
        } else if (sortParams.length === 1) {
            const param = sortParams[0].split(":")
            if (param[0] === NAME_ASC) {
                sort.sortName = param[1] === ASC ? NAME_ASC : NAME_DESC
            } else if (param[0] === DATE_ASC) {
                sort.sortName = param[1] === ASC ? DATE_ASC : DATE_DESC
            } else {
                setError(WRONG_SORT_PARAM)
            }
        } else {
            sortParams.length !== 0 && setError(WRONG_NUMBER_OF_SORT_PARAMS)
        }
        return sort
    }

    const getCertificatesPage = async () => {
        try {
            setError("")
            setIsLoading(true)
            const data = await getCertificates(filterState, currentPage, currentSize, parseSort())
            setTotalPages(data.totalPages)
            setCertificates(data.content)
        } catch (e) {
            if (isAxiosError(e) && e.response)
                if (e.response.status === 404)
                    setError(CHANGE_THE_CRITERIA)
                else
                    setError(e.response.data.detail)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCertificatesPage()
    }, [currentPage, currentSize]);

    useEffect(() => {
        setCertificates([]);
        getCertificatesPage()
    }, [filterState, location]);

    return (isLoading ? <Loader/> :
            <div className="d-flex flex-row flex-wrap justify-content-center lign-self-start mt-2"
                 style={{width: "80%"}}>
                {error && <h3 className="alert alert-danger">{error}</h3>}
                <CertificatesTable certificates={certificates}/>
                <PaginationList totalPages={totalPages} currentPage={currentPage} currentSize={currentSize}/>
            </div>
    );
};

export default AdminUI;
