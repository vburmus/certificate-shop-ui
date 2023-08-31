import React from 'react';
import {Link, useParams} from "react-router-dom";
import { getDateDiffInDays} from "../utils/certificateUtils";
import {Image} from "react-bootstrap";
import '../styles/css/CertificateDetails.css'
import Loader from "./common/Loader";
import {getUserFromStorage} from "../utils/userUtils";
import {Bag} from "react-bootstrap-icons";
import useGetCertificate from "./hooks/useGetCertificate";
import {ADMIN} from "../utils/constants";

const CertificateDetails = () => {
    const {certificateId} = useParams();
    const {certificate, error, isLoading} = useGetCertificate(certificateId ? parseInt(certificateId) : null);
    const user = getUserFromStorage();
    const isAdmin = user && user.role ===ADMIN

    return isLoading ? <Loader/> : (certificate && !error ?
            <div className="certificate-container-description col-10">
                <div className="long-details-container col-12 col-lg-8 ">
                    <div className="image-container">
                        <Image src={certificate.imageURL} className="scaled-image"/>
                    </div>
                    <div className="info-container">
                        <p>{certificate.longDescription}</p>
                    </div>
                </div>
                <div className="short-details-container col-12 col-lg-3 ">
                    <h3>{certificate.name}</h3>
                    <p>{certificate.shortDescription}</p>
                    <p>Time Left To Buy </p>
                    <p><b>{getDateDiffInDays(certificate.durationDate)} days</b></p>
                    <div className="info-container">
                        <h4>{certificate.price}</h4>
                        {!isAdmin &&<Link to={`/checkout/${certificate.id}`}><Bag size={24}/></Link>}
                    </div>
                </div>
            </div> : <h1>{error}</h1>
    );
};

export default CertificateDetails;