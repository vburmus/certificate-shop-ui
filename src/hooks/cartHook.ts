import {useState} from 'react';
import {addPosition, getPositionByCertificateId, removePosition} from "../utils/cartUtils";
import {Certificate} from "../utils/types";

const useCart = (certificate: Certificate | null) => {
    const [isInBag, setIsInBag] = useState(certificate ? getPositionByCertificateId(certificate.id) != null : false);

    const handleAddToCart = () => {
        if (certificate != null) {
            const newPosition = {
                certificateId: certificate.id,
                durationDate: certificate.durationDate,
                quantity: 1
            };
            setIsInBag(true);
            addPosition(newPosition);
        }
    };

    const handleRemoveFromCart = () => {
        if (certificate != null) {
            setIsInBag(false);
            removePosition(certificate.id);
        }
    };

    return {
        isInBag,
        handleAddToCart,
        handleRemoveFromCart
    };
};

export default useCart;