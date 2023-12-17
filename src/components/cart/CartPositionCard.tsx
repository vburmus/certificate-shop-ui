import React, {useEffect, useState} from 'react';
import {Image} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import "../../styles/css/CartPositionCard.css"
import {DashCircle, PlusCircle} from "react-bootstrap-icons";
import {removePosition, updatePositionQuantity} from "../../utils/cartUtils";
import {getCertificateById, getDateDiffInDays} from "../../utils/certificateUtils";
import ConfirmationModal from "../common/ConfirmationModal";
import {Button} from "reactstrap";
import {useDispatch} from "react-redux";
import {addTagFilter} from "../../redux/filterSlice";
import {CartPosition, Certificate} from "../../utils/types";

type CartPositionProps = {
    position: CartPosition;
};
const CartPositionCard = (props: CartPositionProps) => {
    const {position} = props;
    const [certificate, setCertificate] = useState<Certificate>();
    const [quantity, setQuantity] = useState(position.quantity)
    const daysLeft = certificate ? getDateDiffInDays(certificate.durationDate) : -1;
    const [isDeleting, setIsDeleting] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleDecrementQuantity = () => {
        quantity - 1 < 1 ? setIsDeleting(true) : setQuantity(quantity - 1)
    }
    const handleIncrementQuantity = () => {
        setQuantity(quantity + 1)
    }
    const handleCheckSimilar = () => {
        certificate?.tags.map((tag) => dispatch(addTagFilter(tag.id)))
        navigate("/")
    }
    const getCertificate = async () => {
        const loadedCertificate = await getCertificateById(position.certificateId)
        setCertificate(loadedCertificate)
    }
    useEffect(() => {
        updatePositionQuantity(certificate?.id, quantity)
    }, [quantity]);
    useEffect(() => {
        getCertificate()
    }, []);
    return !certificate ? <h4>Error loading certificate</h4> :
        <div className="bg-white rounded-2 shadow d-flex flex-wrap gap-3 align-items-center p-2">
            <div className="image-container col-lg-4 rounded">
                <Image src={certificate.imageUrl} className="scaled-image" alt="Certificate"/>
            </div>
            <div className="d-flex flex-column flex-grow-1">
                <Link to={`/certificate/${certificate.id}`}><h5>{certificate.name}</h5></Link>
                {daysLeft >= 0 ? <p>{daysLeft} days left</p> :
                    <p className="text-danger">Certificate is no longer available </p>
                }
            </div>
            {daysLeft >= 0 &&
                <>
                    <div className="quantity-container d-flex flex-row align-items-center ">
                        <DashCircle size={24} onClick={handleDecrementQuantity}/>
                        <span>{quantity}</span>
                        <PlusCircle size={24} onClick={handleIncrementQuantity}/>
                    </div>
                </>
            }
            <div className="w-25 d-flex flex-column align-items-end gap-3 align-self-end">
                {daysLeft >= 0 ?

                    <span>{Math.round(quantity * certificate.price * 100) / 100}$</span>

                    :
                    <Button className="btn btn-info text-white" onClick={handleCheckSimilar}>Check similar</Button>
                }
                <Button className="btn btn-danger text-white w-50" onClick={() => setIsDeleting(true)}>Delete</Button>
            </div>
            {isDeleting && <ConfirmationModal closeModal={setIsDeleting} action={() => {
                removePosition(certificate.id)
                window.location.reload()
            }} text={`Do you want to delete certificate ?`}/>}
        </div>;
};

export default CartPositionCard;