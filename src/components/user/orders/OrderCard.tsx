import React from 'react';
import {Order} from "../../../utils/types";
import {useNavigate} from "react-router-dom";
import "../../../styles/css/OrderCard.css"
import {formatDate} from "../../../utils/dateUtils";
import {Image} from "react-bootstrap";

interface OrderProps {
    order: Order
}

const OrderCard = (props: OrderProps) => {
    const {order} = props
    const navigate = useNavigate()

    const handleTagClick = (id: number) => {
        navigate("/certificate/" + id)
    }
    return (
        <div className="order d-flex flex-column align-items-center bg-white rounded shadow p-3 ">
            <div className="d-flex flex-wrap gap-5 text-end p-3">
                <h5 className="">#{order.id}</h5>
                <h5>{formatDate(order.createDate)}</h5>
            </div>
            <div className="w-100 text-end flex-grow-1">
                {order.purchaseCertificates.map((pos) =>
                    <div
                        className="order-position d-flex flex-wrap rounded m-2 align-items-center gap-4 p-1 border"
                        onClick={() => handleTagClick(pos.certificate.id)} key={pos.certificate.id}>
                        <div className="image-container-100 rounded">
                            <Image src={pos.certificate.imageUrl} className="scaled-image"/>
                        </div>
                        <span>{pos.certificate.name}</span>
                        <span className="flex-grow-1">{pos.quantity} x {pos.certificate.price}$</span>
                    </div>)}
            </div>
            <div className="p-3 align-self-end "><span>{order.cost}$</span></div>
        </div>
    );
};

export default OrderCard;