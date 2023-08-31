import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import RootState from "../redux/RootState";
import InfiniteScroll from "react-infinite-scroll-component";
import axiosInstance from "../utils/axiosConfig";
import Loader from "./common/Loader";
import 'styles/css/Home.css'
import CertificateList from "./CertificateList";
import TagList from "./TagList";
import {CaretLeft, CaretRight} from "react-bootstrap-icons";
import _ from "lodash";
import {setCurrentPage, setLoadingPage} from "../redux/pageSlice";
import {isAxiosError} from "axios";
import {getCertificates} from "../utils/certificateUtils";
import {CHANGE_THE_CRITERIA, NO_SERVER_RESPONSE} from "../utils/constants";

const Home = () => {
    const [tags, setTags] = useState<any[]>([])
    const [tagsPage, setTagsPage] = useState(1)
    const [isLoadingTags, setIsLoadingTags] = useState<boolean>(true);
    const [hasMoreTags, setHasMoreTags] = useState(true);

    const [certificates, setCertificates] = useState<any[]>([]);
    const [isLoadingCertificates, setIsLoadingCertificates] = useState<boolean>(true);
    const certificatePage = useSelector((state: RootState) => state.page)
    const [hasMoreCertificates, setHasMoreCertificates] = useState(true)

    const filterState = useSelector((state: RootState) => state.filter)
    const size = Math.floor((window.innerWidth * 0.8) / 300) * 2
    const [error, setError] = useState('');
    const dispatch = useDispatch()

    const handlePageChange = _.debounce((page: number) => {
        dispatch(setCurrentPage(page));
    }, 300, {trailing: true});

    const handleLoadChange = _.debounce((loading: boolean) => {
        dispatch(setLoadingPage(loading))
        setIsLoadingCertificates(loading)
    }, 300, {trailing: true});

    const getTags = async () => {
        try {
            setIsLoadingTags(true);
            const response = await axiosInstance.get(`/tag?page=${tagsPage}&size=${size/2}`)
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

    const getMoreCertificates = async () => {
        if (filterState.loading)
            return;
        try {
            handleLoadChange(true)
            setError("")
            if (certificatePage.currentPage === 1) {
                setCertificates([]);
                setHasMoreCertificates(true);
            }
            const data = await getCertificates(filterState,certificatePage.currentPage,size )
            setCertificates(prevItems => [...prevItems, ...data.content])
            handlePageChange(certificatePage.currentPage + 1)
            setHasMoreCertificates(!data.last)
        } catch (e) {
            if (isAxiosError(e) && e.response)
                if (e.response.status === 404)
                    setError(CHANGE_THE_CRITERIA)
                else
                    setError(e.response.data.detail)
        } finally {
            handleLoadChange(false)
        }
    }

    useEffect(() => {
        setCertificates([]);
        getMoreCertificates();
    }, [filterState]);

    useEffect(() => {
        getTags();
    }, [tagsPage]);

    useEffect(() => {
        return () => {
            handlePageChange(1);
        };
    }, []);

    return (isLoadingTags && isLoadingCertificates ? <Loader/> :
            <>
                <div className="tags">
                    {!isLoadingTags && tagsPage !== 1 &&
                        <CaretLeft className="arrow arrow-left" onClick={() => setTagsPage(tagsPage - 1)} size={24}/>
                    }
                    {isLoadingTags ? <Loader/> : <TagList tags={tags}/>}
                    {!isLoadingTags && hasMoreTags &&
                        <CaretRight className="arrow arrow-right" onClick={() => setTagsPage(tagsPage + 1)} size={24}/>
                    }
                </div>
                {!error ?
                    <InfiniteScroll next={getMoreCertificates} className="certificates" hasMore={hasMoreCertificates}
                                    loader={<Loader/>}
                                    dataLength={certificates.length}>
                        <CertificateList certificates={certificates}/>
                    </InfiniteScroll>
                    :
                    <h5 className="alert alert-warning">{error}</h5>}
            </>
    );
};
export default Home;