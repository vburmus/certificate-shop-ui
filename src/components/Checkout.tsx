import React, {FormEvent, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Form, Input} from "reactstrap";
import {Order, Summary} from "../utils/types";
import {getUserFromStorage, placeOrder} from "../utils/userUtils";
import {isAxiosError} from "axios";
import Loader from "./common/Loader";
import {Image} from "react-bootstrap";
import _ from "lodash";
import useGetCertificate from "./hooks/useGetCertificate";
import {CHECK_THE_FORM, SHORT_REGEX} from "../utils/constants";

const Checkout = () => {
    const {certificateId} = useParams();
    const [success, setSuccess] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [validQuantity, setValidQuantity] = useState(false)
    const [description, setDescription] = useState("")
    const [validDescription, setValidDescription] = useState(false)
    const navigate = useNavigate()
    const {certificate, error, isLoading, setError, setIsLoading} = useGetCertificate(certificateId ? parseInt(certificateId) : null);
    const user = getUserFromStorage()


    useEffect(() => {
        setValidQuantity(quantity > 0)
    }, [quantity]);

    useEffect(() => {
        setValidDescription(SHORT_REGEX.test(description))
    }, [description]);

    const handleInputChange = _.debounce((value: any, callback: React.Dispatch<React.SetStateAction<any>>) => {
        callback(value)
    }, 500)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault();
        setIsLoading(true)
        if (!(validQuantity && validDescription)) {
            setError(CHECK_THE_FORM)
            return;
        }
        if (certificate && user) {
            try {
                const summary: Summary = {
                    giftCertificate: certificate,
                    quantity: quantity
                }
                const order: Order = {
                    description: description,
                    giftCertificateHasOrders: [summary],
                    user: user
                }
                const data = await placeOrder(JSON.stringify(order))
                setSuccess(`ID = ${data.id} Total cost: ${data.cost}`)
            } catch (e) {
                if (isAxiosError(e) && e.response)
                    setError(e.response.data.detail)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (success ? <section>
        <div className="alert alert-success p-3 d-flex flex-column align-items-center">
            <h1 className="alert-heading">Order placed!</h1>
            <hr/>
            <p>{success}</p>
            <Link className="btn btn-success" to="/">Go back</Link>
        </div>
    </section> : isLoading ? <Loader/> : (certificate && !error ?
            <div className="bg-white p-3 w-50">
                <h4 className="p-2 text-center d-block d-md-none ">Checkout</h4>
                <div className="d-flex flex-row flex-wrap justify-content-around">
                    <div className="col-7 d-flex flex-row flex-wrap justify-content-center">
                        <div className="col-8">
                            <Image src={certificate.imageURL} className="scaled-image"/>
                        </div>
                        <div className=" text-center align-self-center">
                            <h6>{certificate.name}</h6>
                            <p>{certificate.shortDescription}</p>
                            <p>Price: {certificate.price}</p>
                        </div>
                    </div>
                    <Form className="d-flex flex-column align-items-center justify-content-center"
                          onSubmit={handleSubmit}>
                        <h4 className="p-2 text-center d-none d-md-block">Checkout</h4>
                        <span>Quantity</span>
                        <Input type="number"
                               className={!validQuantity ? "border-warning-subtle shadow-none" : "border-info"}
                               onChange={(e) => handleInputChange(parseInt(e.target.value), setQuantity)}/>
                        <span>Description</span>
                        <Input type="text"
                               className={!validDescription ? "border-warning-subtle shadow-none" : "border-info"}
                               onChange={(e) => handleInputChange(e.target.value, setDescription)}/>
                        <div className="align-self-center pt-2">
                            <Button className="btn btn-danger" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button className="btn btn-success"
                                    disabled={!(validDescription && validQuantity)}>Confirm</Button>
                        </div>
                    </Form>
                </div>
            </div> : <h1>{error}</h1>
    ));
};

export default Checkout;