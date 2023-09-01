import React from 'react';
import {Image} from "react-bootstrap";
import {Certificate} from "../utils/types";
import {Link} from "react-router-dom";
import {getDateDiffInDays} from "../utils/certificateUtils";
import "../styles/css/CertificateCard.css"
import {getUserFromStorage} from "../utils/userUtils";
import {Bag} from "react-bootstrap-icons";
import {ADMIN} from "../utils/constants";
type CertificateCardProps = {
    certificate: Certificate;
};
const CertificateCard = (props: CertificateCardProps) => {
    const user = getUserFromStorage();
    const isAdmin = user && user.role ===ADMIN
    const { certificate } = props;
    return (
        <div className="certificate-container">
            <div className="image-container">
                <Image src={certificate.imageURL} className="scaled-image" alt="Certificate"/>
            </div>
            <div className="info-container">
                <div className="name">
                    <Link to={`/certificate/${certificate.id}`}><h5>{certificate.name}</h5></Link>
                </div>
                <div className="description">
                    <h6 className="text-secondary">{certificate.shortDescription}</h6>
                </div>
                <div className="duration">
                    <p>Duration: {getDateDiffInDays(certificate.durationDate)}</p>
                </div>
                <div className="divider">
                    <h4>{certificate.price}</h4>
                    {!isAdmin && <Link to={`/checkout/${certificate.id}`}><Bag size={24}/></Link>}
                </div>
            </div>
        </div>
    );
};

export default CertificateCard;