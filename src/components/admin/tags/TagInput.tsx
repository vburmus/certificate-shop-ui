import React, {useEffect, useRef, useState} from 'react';
import {Tag} from "../../../utils/types";
import {Button, Input} from "reactstrap";
import _ from "lodash";
import {isAxiosError} from "axios";
import {getTags} from "../../../utils/tagUtils";
import {toast} from "react-toastify";

interface TagInputProps {
    tags: Tag[],
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>
}

const TagInput: React.FC<TagInputProps> = ({tags, setTags}) => {
        const [inputValue, setInputValue] = useState('');
        const [suggestions, setSuggestions] = useState<Tag[]>([]);
        const [error, setError] = useState("")
        const inputRef = useRef<HTMLInputElement>(null);
        const [tagPage, setTagPage] = useState(0)
        const [totalPages, setTotalPages] = useState(-1)
        const currentSize = 5


        async function getSuggestionTags() {
            return await getTags({inputValue, tagPage, currentSize})
        }

        function filterTags(content: Tag[]) {
            return content.filter((suggestion: Tag) => !tags.find((tag) => tag.name == suggestion.name));
        }

        const getSuggestions = async () => {
            try {
                setError("")
                let data = await getSuggestionTags();
                let result = filterTags(data.content);
                if (result.length > 0) {
                    setSuggestions(result)
                    setTotalPages(data.totalPages)
                } else {
                    if (tagPage < totalPages) {
                        setTagPage(tagPage + 1)
                    } else {
                        setSuggestions([])
                    }
                }

            } catch
                (e) {
                if (isAxiosError(e)) {
                    if (e.response) {
                        setError(e.response.data.detail)
                    }
                }
            }
        }
        const handleInputChange = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        }, 700);

        useEffect(() => {
            setTagPage(0)
            getSuggestions()
        }, [inputValue]);
        useEffect(() => {
            getSuggestions()
        }, [tagPage]);

        useEffect(() => {
            getSuggestions()
        }, []);
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

            if (tags.length < 1)
                toast.info("Should have at least 1 tag")
            if (tags.length > 5) {
                toast.info("Should have at most 6 tags")
            }
            getSuggestions()
        }, [tags]);

        const handleTagRemove = (tag: Tag) => {
            setTags((tags) => tags.filter(t => t !== tag))
        };

        return (error ? <div className="alert alert-info"><h3>{error}</h3></div> :
                <div className="col-6 mt-2">
                    <div className="d-flex flex-row flex-wrap">
                        {tags.length > 0 && tags.map((tag) => (
                            <p key={tag.id} className="border border-secondary-subtle rounded p-1">{tag.name}
                                <Button className="btn-close m-1 bg-danger" onClick={() => handleTagRemove(tag)}>
                                </Button>
                            </p>
                        ))}

                    </div>
                    {tags.length < 6 && <div className="d-flex justify-content-center my-2">
                        <div>
                            <Input
                                type="search"
                                innerRef={inputRef}
                                className="border-info shadow"
                                onChange={handleInputChange}
                                placeholder="Tag name"
                            />
                        </div>
                        <Button onClick={handleInputSubmit}>Add</Button>
                    </div>}
                    {<div className={tags.length > 5 ? "d-none" : "d-flex align-items-center justify-content-center"}>
                        <div className="d-flex flex-wrap align-items-center">
                            {suggestions
                                .map((suggestion) => (
                                    <div key={suggestion.id}>
                                        <a className="btn btn-info pe-auto" key={suggestion.id} onClick={(_) => {
                                            setInputValue(suggestion.name);
                                            if (inputRef.current) {
                                                inputRef.current.value = suggestion.name;
                                                inputRef.current.focus();
                                            }
                                        }}>{suggestion.name}
                                        </a>
                                        <br/>
                                    </div>
                                ))}
                        </div>
                    </div>
                    }
                </div>
        );
    }
;

export default TagInput;