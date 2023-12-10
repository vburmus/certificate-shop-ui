import React, {useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "reactstrap";
import {TOKEN} from "../../utils/constants";
import {tryActivateAccount} from "../../utils/userUtils";
import axios from "axios";
import {toast} from "react-toastify";
import Loader from "../common/Loader";


const ActivateAccount = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get(TOKEN);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleActivation = async () => {
        setIsLoading(true)
        try {
            if (token == null)
                toast.info("You need to use link from email")
            else {
                await tryActivateAccount(token);
                navigate("/login")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setError(error.response.data.detail);
                } else {
                    setError(error.message);
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        isLoading ? <Loader/> :
            error ? <div className="alert alert-info"><h3>{error}</h3></div> :
                <section>
                    <div className="alert alert-info d-flex flex-wrap justify-content-center">
                        <h1 className="alert-heading">Activate your account!</h1>
                        <hr className="w-100"/>
                        <Button className="btn btn-info w-25" onClick={handleActivation}>Activate</Button>
                    </div>
                </section>
    );
};

export default ActivateAccount;