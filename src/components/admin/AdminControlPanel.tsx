import React from "react";
import {Button} from "reactstrap";
import {useLocation, useNavigate} from "react-router-dom";
import {MONTHS} from "../../utils/constants";

export const AdminControlPanel = () => {

    const today = new Date();
    const day = today.getDate();
    const monthIndex = today.getMonth();
    const year = today.getFullYear();
    const formattedDate = `${day} ${MONTHS[monthIndex]} ${year}`;
    const navigate = useNavigate();
    const location = useLocation();
    const navigateTo = (locationTo: string) => {
        navigate(location.pathname + locationTo)
    }

    return (
        <div className="bg-white w-25 rounded d-flex flex-column align-items-center p-3 shadow gap-2">
            <div className="text-dark-emphasis"><h5>Welcome to Admin Panel!</h5></div>
            <div className="text-secondary"><h5>{formattedDate}</h5></div>
            <div className="d-flex flex-wrap flex-column gap-1">
                <Button className="btn-info p-2 shadow text-white" outline={true}
                        onClick={() => navigateTo("/certificates")}>Certificates</Button>
                <Button className="btn-info p-2 shadow text-white" outline={true}
                        onClick={() => navigateTo("/tags")}>Tags</Button>
                <Button className="btn-info p-2 shadow text-white" outline={true}
                        onClick={() => navigateTo("/orders")}>Orders</Button>
            </div>
        </div>
    );
};