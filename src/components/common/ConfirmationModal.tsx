import React from 'react';
import "../../styles/css/Modal.css"
import {Button} from "reactstrap";

interface ConfirmationModalProps {
    closeModal: React.Dispatch<React.SetStateAction<boolean>>,
    action: () => void,
    text: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({closeModal, action, text}) => {
    return (
        <>
            <div className="modal-overlay" onClick={() => closeModal(false)}/>
            <div className="modal-container">
                <h5>{text}</h5>
                <div className="d-flex flex-row flex-wrap justify-content-around w-100 pt-3">
                    <Button className="btn btn-info" onClick={() => closeModal(false)}>Go back</Button>
                    <Button className="btn btn-danger" onClick={action}>Confirm</Button>
                </div>
            </div>
        </>
    );
};

export default ConfirmationModal;