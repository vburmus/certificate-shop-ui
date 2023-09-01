import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Form} from "reactstrap";
import {FormControl, Image} from "react-bootstrap";
import 'styles/css/Login.css'
import axios from "axios";
import {setUserInStorage, tryLogin} from "../utils/userUtils";
import Loader from "./common/Loader";
import {CHECK_THE_FORM} from "../utils/constants";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!(email && password)) {
            setError(CHECK_THE_FORM)
        }
        e.preventDefault()
        setIsLoading(true)
        try {
            const user = await tryLogin(email, password);
            setUserInStorage(user)
            setError("");
            navigate("/")
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
        <div className="login-container">
            {isLoading ?
                <Loader/> :
                <>
                    <Image className="img-fluid" src="/logo.png"/>
                    <Form onSubmit={handleLogin}>
                        <FormControl
                            type="email"
                            placeholder="Email"
                            className="me-2"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormControl
                            type="password"
                            placeholder="Password"
                            className="me-2"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button className="btn btn-success" type="submit" disabled={!(email && password)}>Login</Button>
                    </Form>
                </>
            }
            {error && <div className="alert alert-warning w-100 text-center" role="alert">{error}</div>}
        </div>
    );
};

export default Login;