import React, {FormEvent, useEffect, useState} from 'react';
import {Button, Form, Input} from "reactstrap";
import "./../../styles/css/Modal.css"
import {Certificate, Tag} from "../../utils/types";
import _, {toString} from "lodash";
import TagInput from "./TagInput";
import {Image} from "react-bootstrap";
import {isAxiosError} from "axios";
import {updateCertificate} from "../../utils/certificateUtils";
import {useNavigate} from "react-router-dom";
import Loader from "../common/Loader";
import useFormValidation from "../hooks/useFormValidationHook";

interface ModalProps {
    closeModal: React.Dispatch<React.SetStateAction<boolean>>,
    certificate: Certificate
}

const EditingModal: React.FC<ModalProps> = ({closeModal, certificate}) => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState<number>()
    const [shortDescription, setShortDescription] = useState("")
    const [longDescription, setLongDescription] = useState("")
    const [tags, setTags] = useState<Tag[]>(certificate.tags)
    const [durationDate, setDurationDate] = useState<Date | null>(null)
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const {validName, validPrice, validShortDescription, validLongDescription, validDate, validImage, validTags} = useFormValidation(name, price, shortDescription, longDescription, durationDate, image, tags)


    useEffect(() => {
        setError('')
    }, [name, price, shortDescription, longDescription, image, durationDate]);

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
            if (price) {
                mergePatch += `"price":${price},`
            }
            if (shortDescription) {
                mergePatch += `"shortDescription":"${shortDescription}",`
            }
            if (longDescription) {
                mergePatch += `"longDescription":"${longDescription}",`
            }
            if (durationDate)
                mergePatch += `"durationDate": "${durationDate}:00",`
            if (tags !== certificate.tags) {
                mergePatch += `"tags":${JSON.stringify(tags)}`
            }
            if (mergePatch.endsWith(','))
                mergePatch = mergePatch.substring(0, mergePatch.length - 1)
            mergePatch += "}"
            const formData = new FormData();
            formData.append("patch", new Blob([mergePatch], {type: "application/json-patch+json"}));

            if (image) {
                formData.append("image", image);
            }
            console.log(formData)
            const response = await updateCertificate(certificate.id, formData);
            navigate(`/certificate/${response.id}`)

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
                <h6>Edit certificate with ID = {certificate.id}</h6>
                {isLoading ? <Loader/> :
                    <Form className="d-flex flex-column flex-wrap align-items-center" onSubmit={handleSubmit}
                          encType="multipart/form-data">
                        <div className="d-flex flex-row flex-wrap justify-content-between p-3">
                            <div className="col-4 p-1">
                                <span>Name</span>
                                <Input placeholder={certificate.name} type="text"
                                       onChange={e => (handleInputChange(e.target.value, setName))}/>
                                {name && !validName &&
                                    <span className="custom-invalid">
                                    3 to 15 characters
                                    </span>
                                }
                            </div>
                            <div className="col-2 p-1">
                                <span>Price</span>
                                <Input placeholder={toString(certificate.price)} type="number"
                                       onChange={e => (handleInputChange(e.target.value, setPrice))}/>
                                {price && !validPrice &&
                                    <span className="custom-invalid">
                                        Price should be greater than 0
                                    </span>
                                }
                            </div>
                            <div className="col-4 p-1">
                                <span>Valid until {certificate.durationDate.replace("T", " ")}</span>
                                <Input type="datetime-local"
                                       onChange={e => (handleInputChange(e.target.value, setDurationDate))}/>
                            </div>
                            <div className="col-12 p-1">
                                <span>Short description</span>
                                <Input placeholder={certificate.shortDescription} type="text"
                                       onChange={e => (handleInputChange(e.target.value, setShortDescription))}/>
                                {shortDescription && !validShortDescription &&
                                    <span className="custom-invalid">
                                    10 to 50 characters
                                    </span>
                                }
                            </div>
                        </div>
                        <hr className="col-12"/>
                        <div className="form-group  d-flex justify-content-around">
                            <div className="col-3">
                                <div className={"image-container"}>
                                    <Image src={certificate.imageURL} className="scaled-image"/>
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
                            <TagInput tags={tags} setTags={setTags}/>
                        </div>
                        <hr className="col-12"/>
                        <div className="form-group col-10">
                            <span>Long description</span>
                            <Input placeholder={certificate.longDescription} type="textarea"
                                   style={{minHeight: "100px", maxHeight: "120px"}}
                                   onChange={e => (handleInputChange(e.target.value, setLongDescription))}/>
                            {longDescription && !validLongDescription &&
                                <span className="custom-invalid">
                                    100 to 600 characters
                                </span>
                            }
                        </div>
                        {error && <h4 className="alert alert-warning">{error}</h4>}
                        <div className="m-2">
                            <Button className="btn btn-danger m-2" onClick={() => closeModal(false)}>Cancel</Button>
                            <Button className="btn btn-success"
                                    disabled={!((name && validName) || (price !== 0 && validPrice) ||
                                        (durationDate && validDate) || (shortDescription && validShortDescription) ||
                                        (longDescription && validLongDescription) || (image != null && validImage) ||
                                        (!tags.every(tag => certificate.tags.includes(tag))) && validTags)}>Submit</Button>
                        </div>
                    </Form>
                }
            </div>
        </div>
    );
};

export default EditingModal;