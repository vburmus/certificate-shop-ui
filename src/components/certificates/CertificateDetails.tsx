import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getDateDiffInDays} from "../../utils/certificateUtils";
import {Image} from "react-bootstrap";
import '../../styles/css/CertificateDetails.css'
import Loader from "../common/Loader";
import {getUserFromStorage} from "../../utils/userUtils";
import {Bag, BagCheckFill} from "react-bootstrap-icons";
import useGetCertificate from "../../hooks/useGetCertificate";
import {ADMIN} from "../../utils/constants";
import useCart from "../../hooks/cartHook";
import {Button} from "reactstrap";

const CertificateDetails = () => {
    const {certificateId} = useParams();
    const {certificate, error, isLoading} = useGetCertificate(certificateId ? parseInt(certificateId) : -1);
    const user = getUserFromStorage();
    const isAdmin = user && user.role === ADMIN
    const {isInBag, handleAddToCart, handleRemoveFromCart} = useCart(certificate);
    const daysLeft = certificate ? getDateDiffInDays(certificate.durationDate) : -1;
    const navigate = useNavigate();
    return isLoading ? <Loader/> : (certificate && !error ?
            <div className="certificate-container-description col-10">
                <div className="long-details-container col-12 col-lg-8 ">
                    <div className="image-container">
                        <Image src={certificate.imageUrl} className="scaled-image rounded"/>
                    </div>
                    <div className="info-container bg-white rounded shadow mt-2">
                        <p>{certificate.longDescription}</p>
                    </div>
                </div>
                <div className="short-details-container col-12 col-lg-3 shadow rounded">
                    <h3>{certificate.name}</h3>
                    <p>{certificate.shortDescription}</p>
                    <p> {daysLeft >= 0 ? `Duration: ${daysLeft} days` : "Expired"}</p>
                    <p> Tags: {certificate.tags.map((tag) => tag.name).join(", ")}</p>
                    <div className="info-container">
                        <h4>{certificate.price}$</h4>
                        {isAdmin ? <Button onClick={() => navigate(-1)} className="btn-info">Go Back</Button> :
                            isInBag ?
                                <BagCheckFill size={24} onClick={handleRemoveFromCart}/>
                                :
                                <Bag size={24} onClick={handleAddToCart}/>}
                    </div>
                </div>
            </div> : <h1>{error}</h1>
    );
};

export default CertificateDetails;