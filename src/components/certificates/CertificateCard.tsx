import React from 'react';
import {Image} from "react-bootstrap";
import {Certificate} from "../../utils/types";
import {Link} from "react-router-dom";
import {getDateDiffInDays} from "../../utils/certificateUtils";
import "../../styles/css/CertificateCard.css"
import {getUserFromStorage} from "../../utils/userUtils";
import {Bag, BagCheckFill} from "react-bootstrap-icons";
import {ADMIN} from "../../utils/constants";
import useCart from "../../hooks/cartHook";

type CertificateCardProps = {
    certificate: Certificate;
};
const CertificateCard = (props: CertificateCardProps) => {
    const user = getUserFromStorage();
    const isAdmin = user && user.role === ADMIN
    const {certificate} = props;
    const daysLeft = getDateDiffInDays(certificate.durationDate);
    const {isInBag, handleAddToCart, handleRemoveFromCart} = useCart(certificate);

    return (
        <div className={daysLeft >= 0 ? "certificate-container shadow" : "certificate-container expired shadow"}>
            <div className="image-container">
                <Image src={certificate.imageUrl} className="scaled-image" alt="Certificate"/>
            </div>
            <div className="info-container">
                <div className="name">
                    <Link to={`/certificate/${certificate.id}`}><h5>{certificate.name}</h5></Link>
                </div>
                <div className="description">
                    <h6 className="text-secondary">{certificate.shortDescription}</h6>
                </div>
                <div className="duration">
                    <p> {daysLeft >= 0 ? `Duration: ${daysLeft} days` : "Expired"}</p>
                </div>
                <div className="divider">
                    <h4>{certificate.price}$</h4>
                    {!isAdmin && (daysLeft >= 0 ?
                        isInBag ?
                            <BagCheckFill size={24} onClick={handleRemoveFromCart}/>
                            :
                            <Bag size={24} onClick={handleAddToCart}/> : null)}
                </div>
            </div>
        </div>
    );
};

export default CertificateCard;