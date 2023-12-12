import React, {FormEvent, useEffect, useState} from 'react';
import {Button, Form, Input} from "reactstrap";
import "../../../styles/css/Modal.css"
import "../../../styles/css/EditingModal.css"
import {Tag} from "../../../utils/types";
import _ from "lodash";
import {Image} from "react-bootstrap";
import {isAxiosError} from "axios";
import Loader from "../../common/Loader";
import useFormValidation from "../../../hooks/useFormValidationHook";
import {updateTag} from "../../../utils/tagUtils";

interface ModalProps {
    closeModal: React.Dispatch<React.SetStateAction<boolean>>,
    tag: Tag
}

const TagEditingModal: React.FC<ModalProps> = ({closeModal, tag}) => {
    const [name, setName] = useState("")
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const {validName, validImage} = useFormValidation({name, image})


    useEffect(() => {
        setError('')
    }, [name, image]);

    const handleInputChange = _.debounce((value: any, callback: React.Dispatch<React.SetStateAction<any>>) => {
        callback(value)
    }, 500)


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault();
        setIsLoading(true)
        try {
            let mergePatch = "{";
            if (name) {
                mergePatch += `"name":"${name}",`
            }
            if (mergePatch.endsWith(','))
                mergePatch = mergePatch.substring(0, mergePatch.length - 1)
            mergePatch += "}"
            const formData = new FormData();
            formData.append("patch", new Blob([mergePatch], {type: "application/json-patch+json"}));

            if (image) {
                formData.append("image", image);
            }
            await updateTag(tag.id, formData);
            window.location.reload()
        } catch (err) {
            if (isAxiosError(err)) {
                if (!err?.response) {
                    setError('No Server Response')
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
        <div>
            <div className="modal-overlay" onClick={() => closeModal(false)}/>
            <div className="modal-container">
                <h6>Edit tag with ID = {tag.id}</h6>
                {isLoading ? <Loader/> :
                    <Form className="d-flex flex-column flex-wrap align-items-center" onSubmit={handleSubmit}
                          encType="multipart/form-data">
                        <div className="d-flex flex-column align-items-center gap-2 p-3">

                            <span>Name</span>
                            <Input placeholder={tag.name} type="text"
                                   onChange={e => (handleInputChange(e.target.value, setName))}/>
                            {name && !validName &&
                                <span className="custom-invalid">
                                    3 to 15 characters
                                    </span>
                            }
                            <div className="d-flex flex-column align-items-center gap-2">
                                <div className="image-container-300 rounded">
                                    <Image src={tag.imageUrl} className="scaled-image"/>
                                </div>
                                <Input type="file" onChange={(e) => {
                                    if (e.target.files) handleInputChange(e.target.files[0], setImage)
                                }}/>
                                {image && !validImage &&
                                    <span className="custom-invalid">
                                    Image is not valid
                                    </span>
                                }
                            </div>

                            {error && <h4 className="alert alert-warning">{error}</h4>}
                            <div className="m-2">
                                <Button className="btn btn-danger m-2" onClick={() => closeModal(false)}>Cancel</Button>
                                <Button className="btn btn-success"
                                        disabled={!((name && validName) || (image != null && validImage))}>Submit</Button>
                            </div>
                        </div>
                    </Form>
                }
            </div>
        </div>
    );
};

export default TagEditingModal;