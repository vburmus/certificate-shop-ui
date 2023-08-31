import React, {useEffect, useRef, useState} from 'react';
import {Tag} from "../../utils/types";
import {Button, Input} from "reactstrap";
import _ from "lodash";
import {isAxiosError} from "axios";
import {getTags} from "../../utils/tagUtils";
import {ArrowLeft, ArrowRight, Dot} from "react-bootstrap-icons";
import Loader from "../common/Loader";

interface TagInputProps {
    tags: Tag[],
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>
}

const TagInput: React.FC<TagInputProps> = ({tags, setTags}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Tag[]>([]);
    const [error, setError] = useState("")
    const inputRef = useRef<HTMLInputElement>(null);
    const [tagPage, setTagPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true);

    const getSuggestions = async () => {
        try {
            setError("")
            setIsLoading(true)
            let query;
            if (inputValue) {
                query = `/tag/search/by-name-part?page=1&size=5&part=${inputValue}`
            } else {
                query = `/tag?page=${tagPage}&size=5`
            }
            const data = await getTags(query)
            setSuggestions(data.content)
            setTotalPages(data.totalPages)
        } catch (e) {
            if (isAxiosError(e)) {
                if (e.response) {
                    setError(e.response.data.detail)
                }
            }
        } finally {
            setIsLoading(false)
        }
    }
    const handleInputChange = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }, 700);

    useEffect(() => {
        getSuggestions()
    }, [inputValue, tagPage]);
    const handleInputSubmit = () => {
        if (inputValue.trim() !== '') {
            if (!tags.some((tag) => tag.name === inputValue)) {
                const tag = suggestions.find((suggestion) => suggestion.name === inputValue);
                if (tag) {
                    setTags((prev) => [...prev, tag]);
                    setInputValue('');
                    if (inputRef.current)
                        inputRef.current.value = ""
                } else {
                    setError("There is no such tag")
                }
            } else {
                setError("Such tag exists")
            }
        }
    };
    useEffect(() => {
        setError("")
        if (tags.length < 1 )
            setError("Should have at least 1 tag")
        if(tags.length >6)
            setError("Should have at most 6 tags")
    }, [tags]);

    const handleTagRemove = (tag: Tag) => {
        setTags((tags) => tags.filter(t => t !== tag))
    };

    return (
        <div className="col-6 mt-2">
            <div className="d-flex flex-row flex-wrap">
                {tags.length > 0 && tags.map((tag) => (
                    <p key={tag.id} className="border border-secondary-subtle rounded p-1">{tag.name}
                        <Button className="btn btn-danger px-2 py-0 mx-2" onClick={() => handleTagRemove(tag)}>X
                        </Button>
                    </p>
                ))}

            </div>
            <div className="d-flex justify-content-center my-2">
                <div>
                    <Input
                        type="search"
                        innerRef={inputRef}
                        className={error ? "border-warning-subtle shadow-none" : "border-info"}
                        onChange={handleInputChange}
                        placeholder="Tag name"
                    />
                    <span className="custom-invalid">
                                  {error}
                                </span>
                </div>
                <Button onClick={handleInputSubmit}>Add</Button>
            </div>
            {isLoading ? <Loader/> :
                <div className="d-flex align-items-center justify-content-center">
                    {tagPage > 1 && <ArrowLeft onClick={() => setTagPage(tagPage - 1)}/>}
                    <div className="suggestions-list col-6">
                        {suggestions
                            .filter((suggestion) => suggestion.name.toLowerCase().includes(inputValue.toLowerCase()) && !tags.find((tag) => tag.name == suggestion.name))
                            .map((suggestion) => (
                                <div key={suggestion.id}>
                                    <a className="pe-auto" key={suggestion.id} onClick={(e) => {
                                        setInputValue(suggestion.name);
                                        if (inputRef.current) {
                                            inputRef.current.value = suggestion.name;
                                            inputRef.current.focus();
                                        }
                                    }}>
                                        <Dot/> {suggestion.name}
                                    </a>
                                    <br/>
                                </div>
                            ))}
                    </div>
                    {tagPage !== totalPages && <ArrowRight onClick={() => setTagPage(tagPage + 1)}/>}
                </div>
            }
        </div>
    );
};

export default TagInput;