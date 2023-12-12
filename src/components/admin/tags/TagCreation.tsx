import React, {FormEvent, useEffect, useState} from 'react';
import Loader from "../../common/Loader";
import {Button, Form, Input} from "reactstrap";
import _ from "lodash";
import {useNavigate} from "react-router-dom";
import {isAxiosError} from "axios";
import {createTag} from "../../../utils/tagUtils";
import {ALLOWED_IMG, CHECK_THE_FORM, NO_SERVER_RESPONSE, OBJECT_NAME_REGEX} from "../../../utils/constants";


const TagCreation = () => {
    const [name, setName] = useState("")
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [validName, setValidName] = useState(false);
    const [validImage, setValidImage] = useState(false);

    const handleInputChange = _.debounce((value: any, callback: React.Dispatch<React.SetStateAction<any>>) => {
        callback(value)
    }, 500, {trailing: false, leading: true})

    useEffect(() => {
        const result = OBJECT_NAME_REGEX.test(name);
        setValidName(result);
    }, [name]);

    useEffect(() => {
        if (image) {
            if (ALLOWED_IMG.includes(image.type)) {
                setValidImage(true);
            } else {
                setValidImage(false);
            }
        } else {
            setValidImage(true)
        }
    }, [image])
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault();
        if (!OBJECT_NAME_REGEX.test(name)) {
            setError(CHECK_THE_FORM)
            return;
        }
        setIsLoading(true)
        try {
            const tagData = {
                name
            };
            const jsonPayload = JSON.stringify(tagData);
            const blob = new Blob([jsonPayload], {type: 'application/json'});

            const formData = new FormData();
            formData.append("tag", blob);
            if (image) {
                formData.append("image", image);
            }
            await createTag(formData);
            navigate(`/control-panel/tags`)
        } catch (err) {
            if (isAxiosError(err)) {
                if (!err?.response) {
                    setError(NO_SERVER_RESPONSE)
                } else if (err.response?.status === 409) {
                    setError(err.response.data.detail)
                } else {
                    setError('Update failed')
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white p-5 m-5 rounded-2 ">
            <h5 className="text-center">Create new tag</h5>
            {isLoading ? <Loader/> :
                <Form className="d-flex flex-column flex-wrap align-items-center mt-2" onSubmit={handleSubmit}
                      encType="multipart/form-data">
                    <div className="d-flex flex-column flex-wrap justify-content-between my-3">
                        <div className="p-1">
                            <span>Name</span>
                            <Input type="text"
                                   onChange={e => (handleInputChange(e.target.value, setName))}/>
                            {name && !validName && <span className="custom-invalid">3 to 15 characters</span>}
                        </div>
                        <div>
                            <span>Image</span>
                            <Input type="file" onChange={(e) => {
                                if (e.target.files) handleInputChange(e.target.files[0], setImage)
                            }}/>
                            {image && !validImage && <span className="custom-invalid">Image is not valid</span>}
                        </div>
                    </div>
                    {error && <h5 className="alert alert-warning">{error}</h5>}
                    <Button className="btn btn-success"
                            disabled={!((image == null || validImage) && validName)}>Submit</Button>
                </Form>}

        </div>
    );
};

export default TagCreation;