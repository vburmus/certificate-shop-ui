import React from 'react';
import {Image} from "react-bootstrap";
import {Tag} from "../utils/types";
import {addTagFilter, removeTagFilter} from "../redux/filterSlice";
import {setCurrentPage} from "../redux/pageSlice";
import {useDispatch, useSelector} from "react-redux";
import RootState from "../redux/RootState";
import _ from "lodash";

interface TagProps {
    tag: Tag
}

const TagCard = (props: TagProps) => {
    const {tag} = props
    const dispatch = useDispatch()
    const filterState = useSelector((state:RootState) => state.filter)
    const pageState = useSelector((state:RootState) => state.page)

    const handleTagClick = _.debounce((id: number) => {
        if(pageState.loading)
            return;
        if (!filterState.tags.includes(id) ) {
                dispatch(addTagFilter(id))
        } else {
            dispatch(removeTagFilter(id))
        }
        dispatch(setCurrentPage(1))
    },100,{trailing:true})

    return (
        <a className={filterState.tags?.includes(tag.id) ? "tag-container chosen" : "tag-container"} onClick={() => handleTagClick(tag.id)}>
            <div className="image-container">
                <Image src={tag.imageURL} className="scaled-image"/>
            </div>
            <div className="overlay-text">
                <p className="white-text">{tag.name}</p>
            </div>
        </a>
    );
};

export default TagCard;