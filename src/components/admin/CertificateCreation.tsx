import React, {FormEvent, useState} from 'react';
import Loader from "../common/Loader";
import {Button, Form, Input} from "reactstrap";
import _, {toString} from "lodash";
import TagInput from "./TagInput";
import {Tag} from "../../utils/types";
import {useNavigate} from "react-router-dom";
import {createCertificate} from "../../utils/certificateUtils";
import {isAxiosError} from "axios";
import useFormValidation from "../hooks/useFormValidationHook";
import {CHECK_THE_FORM, NO_SERVER_RESPONSE, UPDATE_FAILED} from "../../utils/constants";

const CertificateCreation = () => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState<number>(0)
    const [shortDescription, setShortDescription] = useState("")
    const [longDescription, setLongDescription] = useState("")
    const [tags, setTags] = useState<Tag[]>([])
    const [durationDate, setDurationDate] = useState<Date | null>(null)
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const {validName, validPrice, validShortDescription, validLongDescription, validDate, validImage, validateForm} = useFormValidation(name, price, shortDescription, longDescription, durationDate, image, tags)

    const handleInputChange = _.debounce((value: any, callback: React.Dispatch<React.SetStateAction<any>>) => {
        callback(value)
    }, 500)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault();
        if (!validateForm()) {
            setError(CHECK_THE_FORM)
            return;
        }
        setIsLoading(true)
        const formatDurationDate = toString(durationDate) + ":00"
        try {
            const certificateData = {
                name,
                price,
                shortDescription,
                longDescription,
                durationDate: formatDurationDate,
                tags
            };
            const jsonPayload = JSON.stringify(certificateData);
            const blob = new Blob([jsonPayload], {type: 'application/json'});
            const formData = new FormData();
            formData.append("certificate", blob);
            if (image) {
                formData.append("image", image);
            }
            const response = await createCertificate(formData);
            navigate(`/certificate/${response.id}`)
        } catch (err) {
            if (isAxiosError(err)) {
                if (!err?.response) {
                    setError(NO_SERVER_RESPONSE)
                } else if (err.response?.status === 409) {
                    setError(err.response.data.detail)
                } else {
                    setError(UPDATE_FAILED)
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white p-5 m-5 rounded-2 ">
            <h5 className="text-center">Create new certificate</h5>
            {isLoading ? <Loader/> :
                <Form className="d-flex flex-column flex-wrap align-items-center mt-2" onSubmit={handleSubmit}
                      encType="multipart/form-data">
                    <div className="d-flex flex-row flex-wrap justify-content-between  alip-3">
                        <div className="col-4 p-1">
                            <span>Name</span>
                            <Input type="text"
                                   className={!name || (name && !validName) ? "border-warning-subtle shadow-none" : "border-info"}
                                   onChange={e => (handleInputChange(e.target.value, setName))}/>
                            {name && !validName && <span className="custom-invalid">3 to 15 characters</span>}
                        </div>
                        <div className="col-2 p-1">
                            <span>Price</span>
                            <Input type="number"
                                   className={!validPrice ? "border-warning-subtle shadow-none" : "border-info"}
                                   onChange={e => (handleInputChange(e.target.value, setPrice))}/>
                            {!validPrice && <span className="custom-invalid">Price should be greater than 0</span>}
                        </div>

                        <div className="col-4 p-1">
                            <span>Valid until </span>
                            <Input type="datetime-local"
                                   className={!validDate ? "border-warning-subtle shadow-none" : "border-info"}
                                   onChange={e => (handleInputChange(e.target.value, setDurationDate))}/>
                        </div>

                        <div className="col-5 p-1">
                            <span>Short description</span>
                            <Input type="text"
                                   className={!validShortDescription ? "border-warning-subtle shadow-none" : "border-info"}
                                   onChange={e => (handleInputChange(e.target.value, setShortDescription))}/>
                            {shortDescription && !validShortDescription && <span className="custom-invalid">10 to 50 character</span>}
                        </div>
                        <div className="col-5">
                            <span>Image</span>
                            <Input type="file"
                                   className={!validImage ? "border-warning-subtle shadow-none" : "border-info"}
                                   onChange={(e) => {
                                       if (e.target.files) handleInputChange(e.target.files[0], setImage)
                                   }}/>
                            {image && !validImage && <span className="custom-invalid"> Image is not valid </span>}
                        </div>
                    </div>
                    <hr className="col-12"/>
                    <TagInput tags={tags} setTags={setTags}/>
                    <hr className="col-12"/>
                    <div className="col-10">
                        <span>Long description</span>
                        <Input type="textarea"
                               className={!validLongDescription ? "border-warning-subtle shadow-none" : "border-info"}
                               style={{minHeight: "150px", maxHeight: "200px"}}
                               onChange={e => (handleInputChange(e.target.value, setLongDescription))}/>
                        {longDescription && !validLongDescription && <span className="custom-invalid">100 to 600 characters</span>}
                    </div>
                    <hr className="col-12"/>
                    {error && <h5 className="alert alert-warning">{error}</h5>}
                    <Button className="btn btn-success" disabled={!(validateForm())}>Submit</Button>
                </Form>
            }
        </div>
    );
};

export default CertificateCreation;