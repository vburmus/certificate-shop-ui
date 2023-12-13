import React, {useEffect, useState} from 'react';
import PaginationList from "../../common/PaginationList";
import {useLocation, useNavigate} from "react-router-dom";
import {Certificate} from "../../../utils/types";
import {isAxiosError} from "axios";
import Loader from "../../common/Loader";
import {CHANGE_THE_CRITERIA, PAGE, SIZE} from '../../../utils/constants';
import {Button} from "reactstrap";
import TagsTable from "./TagsTable";
import {getTags} from "../../../utils/tagUtils";


const AdminTagsPage = () => {
    const [error, setError] = useState("")
    const [tags, setTags] = useState<Certificate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get(PAGE);
    let tagPage = page ? parseInt(page) : 1
    const size = queryParams.get(SIZE);
    const currentSize = size ? parseInt(size) : 5
    const [totalElems, setTotalElems] = useState(0)
    const navigate = useNavigate();
    const getTagsPage = async () => {
        try {
            setError("")
            setIsLoading(true)
            const data = await getTags({tagPage, currentSize})
            console.log(data)
            setTotalPages(data.totalPages)
            data.content.length > 0 ? setTags(data.content) : setError(CHANGE_THE_CRITERIA)
            setTotalElems(data.totalElements)
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
        getTagsPage()
    }, [tagPage, currentSize]);

    useEffect(() => {
        setTags([]);
        getTagsPage()
    }, [location]);

    return (isLoading ? <Loader/> :
            error ? <div className="alert alert-info d-flex flex-column align-items-center w-25">
                    <h3>{error}</h3>
                    <Button className="btn btn-info w-50" onClick={() => navigate("/")}>Clear search</Button>
                </div> :
                <div className="d-flex flex-row flex-wrap justify-content-center lign-self-start mt-2 w-25"
                     style={{width: "80%"}}>
                    <TagsTable tags={tags}/>
                    <PaginationList totalPages={totalPages} currentPage={tagPage} currentSize={currentSize}
                                    totalElems={totalElems}/>
                </div>
    );
};

export default AdminTagsPage;
