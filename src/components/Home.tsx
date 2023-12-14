import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import RootState from "../redux/RootState";
import axiosInstance from "../utils/axiosConfig";
import Loader from "./common/Loader";
import 'styles/css/Home.css'
import CertificateList from "./certificates/CertificateList";
import TagList from "./tags/TagList";
import {CaretLeft, CaretRight} from "react-bootstrap-icons";
import {isAxiosError} from "axios";
import {getCertificates} from "../utils/certificateUtils";
import {CHANGE_THE_CRITERIA, NO_SERVER_RESPONSE, PAGE, SIZE} from "../utils/constants";
import PaginationList from "./common/PaginationList";
import {useLocation} from "react-router-dom";
import {Button} from "reactstrap";
import {clearFilters} from "../redux/filterSlice";

const Home = () => {
    const [tags, setTags] = useState<any[]>([])
    const [tagsPage, setTagsPage] = useState(1)
    const [isLoadingTags, setIsLoadingTags] = useState<boolean>(true);
    const [hasMoreTags, setHasMoreTags] = useState(true);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [isLoadingCertificates, setIsLoadingCertificates] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState(0)
    const [totalElems, setTotalElems] = useState(0)
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get(PAGE);
    let currentPage = page ? parseInt(page) : 1
    const size = queryParams.get(SIZE);
    const currentSize = size ? parseInt(size) : Math.floor((window.innerWidth * 0.8) / 300) * 2
    const filterState = useSelector((state: RootState) => state.filter)
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    const getTags = async () => {
        try {
            setIsLoadingTags(true);
            const response = await axiosInstance.get(`api/v1/commerce/tags?page=${tagsPage - 1}&size=${Math.floor((window.innerWidth * 0.8) / 300)}`)
            const data = response.data
            setTags(data.content)
            setHasMoreTags(!data.last)
        } catch (err) {
            if (isAxiosError(err)) {
                if (!err?.response) {
                    setError(NO_SERVER_RESPONSE)
                } else {
                    setError(err.response.data.detail)
                }
            }
        } finally {
            setIsLoadingTags(false)
        }
    }

    const getCertificatesPage = async () => {
        try {
            setError("")
            setIsLoadingCertificates(true)

            let data = await getCertificates(filterState, currentPage, currentSize)
            setTotalPages(data.totalPages)
            setTotalElems(data.totalElements)
            data.content.length > 0 ? setCertificates(data.content) : setError(CHANGE_THE_CRITERIA)

        } catch (e) {
            if (isAxiosError(e) && e.response)
                setError(e.response.data.detail)
        } finally {
            setIsLoadingCertificates(false)
        }
    }

    useEffect(() => {
        getCertificatesPage()
    }, [currentPage]);

    useEffect(() => {
        setCertificates([]);
        getCertificatesPage()
    }, [filterState, location]);

    useEffect(() => {
        getTags();
    }, [tagsPage]);


    return (error ?
            <div className="align-self-center alert alert-info  align-self-start ">
                <h5>{error}</h5>
                <Button className="w-100 btn-info" onClick={() => dispatch(clearFilters())}>Go Back</Button>
            </div>
            : isLoadingTags && isLoadingCertificates ?
                <Loader/> :
                <>
                    <div className="tags shadow">
                        {!isLoadingTags && tagsPage !== 1 &&
                            <CaretLeft className="arrow arrow-left" onClick={() => setTagsPage(tagsPage - 1)}
                                       size={24}/>
                        }
                        {isLoadingTags ? <Loader/> : <TagList tags={tags}/>}
                        {!isLoadingTags && hasMoreTags &&
                            <CaretRight className="arrow-right" onClick={() => setTagsPage(tagsPage + 1)} size={24}/>
                        }
                    </div>
                    {isLoadingCertificates ? <Loader/> :

                        <>
                            <div className="certificates">
                                <CertificateList certificates={certificates}/>
                            </div>
                            <PaginationList totalPages={totalPages} currentPage={currentPage} currentSize={currentSize}
                                            totalElems={totalElems}/>
                        </>
                    }
                </>
    );
};
export default Home;