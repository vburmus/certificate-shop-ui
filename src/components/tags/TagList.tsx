import React from 'react';
import {Tag} from "../../utils/types";
import TagCard from "./TagCard";

interface TagListProps{
    tags:Tag[]
}

const TagList:React.FC<TagListProps> = ({tags}) => {
    return (
            <div className="tags-container">
                { tags.map((tag: Tag) => (
                    <TagCard key={tag.id} tag={tag}/>
                ))}
            </div>
    );
};

export default TagList;
