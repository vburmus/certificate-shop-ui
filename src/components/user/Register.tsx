import React, {FormEvent, useEffect, useRef, useState} from 'react';
import {Button, Form, Input, Label} from "reactstrap";
import '../../styles/css/Register.css'
import _ from "lodash";
import {Link} from "react-router-dom";
import {isAxiosError} from "axios";
import {tryRegister} from "../../utils/userUtils";
import Loader from "../common/Loader";
import {
    ALLOWED_IMG,
    CHECK_THE_FORM,
    EMAIL_REGEX,
    NAME_SURNAME_REGEX,
    NO_SERVER_RESPONSE,
    NUMBER_REGEX,
    PASSWORD_REGEX,
    REGISTRATION_FAILED
} from "../../utils/constants";
import {toast} from "react-toastify";

const Register = () => {
    const errRef = useRef<HTMLParagraphElement>(null);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [surname, setSurname] = useState('');
    const [validSurname, setValidSurname] = useState(false);
    const [surnameFocus, setSurnameFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatchPassword, setValidMatchPassword] = useState(false);
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [phone, setPhone] = useState('');
    const [validNumber, setValidNumber] = useState(false);
    const [numberFocus, setNumberFocus] = useState(false);

    const [image, setImage] = useState<File | null>(null);
    const [validImage, setValidImage] = useState(true);

    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const result = NAME_SURNAME_REGEX.test(name);
        setValidName(result);
    }, [name])

    useEffect(() => {
        const result = NAME_SURNAME_REGEX.test(surname)
        setValidSurname(result)
    }, [surname])

    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        setValidPassword(result);
        const match = password === matchPassword;
        setValidMatchPassword(match);
    }, [password, matchPassword]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        const result = NUMBER_REGEX.test(phone);
        setValidNumber(result);
    }, [phone])

    useEffect(() => {
        if (image) {
            if (ALLOWED_IMG.includes(image.type)) {
                setValidImage(true);
            } else {
                setValidImage(false);
            }
        }
    }, [image])

    useEffect(() => {
        setError('')
    }, [name, surname, password, matchPassword, email, phone]);

    const handleInputChange = _.debounce((value: any, callback: React.Dispatch<React.SetStateAction<any>>) => {
        callback(value)
    }, 500, {trailing: false, leading: true})

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault();
        const v1 = NAME_SURNAME_REGEX.test(name) && NAME_SURNAME_REGEX.test(surname);
        const v2 = PASSWORD_REGEX.test(password);
        const v3 = EMAIL_REGEX.test(email) && NUMBER_REGEX.test(phone);
        if (!(v1 && v2 && v3)) {
            setError(CHECK_THE_FORM)
            toast.info(CHECK_THE_FORM)
            return;
        }
        setIsLoading(true)
        try {
            const formData = new FormData();
            const request = {
                name,
                surname,
                email,
                password,
                phone
            }
            const blob = new Blob([JSON.stringify(request)], {type: 'application/json'});
            formData.append("request", blob);
            if (image) {
                formData.append("image", image);
            }
            await tryRegister(formData);
            setSuccess(true)
        } catch (err) {
            if (isAxiosError(err)) {
                if (!err?.response) {
                    setError(NO_SERVER_RESPONSE)
                    toast.info(NO_SERVER_RESPONSE)
                } else if (err.response?.status === 409) {
                    setError(err.response.data.detail)
                    toast.info(error)
                } else {
                    setError(REGISTRATION_FAILED)
                    toast.info(REGISTRATION_FAILED)
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return isLoading ?
        <Loader/> : <>
            {success ?
                <section>
                    <div className="alert alert-info">
                        <h1 className="alert-heading">Registration completed!</h1>
                        <hr/>
                        <p>Thank you for registration on our service, click the activation link on your email!</p>
                        <Link className="btn btn-info w-25" to="/">Home</Link>
                    </div>
                </section> :
                <section className="register col-md-7 col-lg-5">
                    <div className="register-header">
                        <h2> Register</h2>
                    </div>
                    <Form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}
                          encType="multipart/form-data">
                        <div className="register-form d-flex flex-wrap justify-content-center ">
                            <div className="m-3 col-11 col-md-5">
                                <Label for="nameInput">Name: </Label>
                                <Input
                                    id="nameInput"
                                    type="text"
                                    placeholder="Enter name"
                                    aria-label="Name"
                                    className={!name || (name && !validName) ? "border-danger-subtle shadow-none" : "border-info"}
                                    autoComplete="off"
                                    required
                                    onChange={e => {
                                        handleInputChange(e.target.value, setName)
                                    }}
                                    onFocus={() => setNameFocus(true)}
                                    onBlur={() => setNameFocus(false)}
                                />
                                <span className={nameFocus && name && !validName ? "custom-invalid " : "d-none"}>
                                            3 to 23 characters, only letters
                                        </span>
                            </div>
                            <div className="m-3 col-11 col-md-5">
                                <Label for="surnameInput">Surname: </Label>
                                <Input
                                    id="surnameInput"
                                    type="text"
                                    placeholder="Enter surname"
                                    className={!surname || (surname && !validSurname) ? "border-danger-subtle shadow-none" : "border-info"}
                                    autoComplete="off"
                                    onChange={(e) => handleInputChange(e.target.value, setSurname)}
                                    onFocus={() => setSurnameFocus(true)}
                                    onBlur={() => setSurnameFocus(false)}
                                />
                                <span
                                    className={surnameFocus && surname && !validSurname ? "custom-invalid " : "d-none"}>
                                            3 to 23 characters, only letters
                                        </span>
                            </div>
                            <div className="m-3 col-11 col-md-5 ">
                                <Label for="passwordInput">Password: </Label>
                                <Input
                                    id="passwordInput"
                                    type="password"
                                    placeholder="Enter password"
                                    className={!password || (password && !validPassword) ? "border-danger-subtle shadow-none" : "border-info"}
                                    autoComplete="off"
                                    onChange={(e) => handleInputChange(e.target.value, setPassword)}
                                    onFocus={() => setPasswordFocus(true)}
                                    onBlur={() => setPasswordFocus(false)}
                                />
                                <span
                                    className={passwordFocus && password && !validPassword ? "custom-invalid " : "d-none"}>
                                            1 small, 1 big letter; 1 special; 1 number; 8 symbols
                                        </span>
                            </div>
                            <div className="m-3 col-11 col-md-5">
                                <Label for="matchPasswordInput">Repeat password: </Label>
                                <Input
                                    id="matchPasswordInput"
                                    type="password"
                                    placeholder="Repeat password"
                                    className={!matchPassword || (matchPassword && !validMatchPassword) ? "border-danger-subtle shadow-none" : "border-info"}
                                    autoComplete="off"
                                    onChange={(e) => handleInputChange(e.target.value, setMatchPassword)}
                                    onFocus={() => setMatchPasswordFocus(true)}
                                    onBlur={() => setMatchPasswordFocus(false)}
                                />
                                <span
                                    className={matchPasswordFocus && matchPassword && !validMatchPassword ? "custom-invalid " : "d-none"}>
                                        Passwords must match
                                        </span>
                            </div>
                            <div className="m-3 col-11 col-md-5">
                                <Label for="emailInput">Email: </Label>
                                <Input
                                    id="emailInput"
                                    type="text"
                                    placeholder="Enter email"
                                    className={!email || (email && !validEmail) ? "border-danger-subtle shadow-none" : "border-info"}
                                    autoComplete="off"
                                    onChange={(e) => handleInputChange(e.target.value, setEmail)}
                                    onFocus={() => setEmailFocus(true)}
                                    onBlur={() => setEmailFocus(false)}
                                />
                                <span
                                    className={emailFocus && email && !validEmail ? "custom-invalid " : "d-none"}>
                                        Email is not valid
                                        </span>
                            </div>
                            <div className="m-3 col-11 col-md-5">
                                <Label for="numberInput">Number: </Label>
                                <Input
                                    id="numberInput"
                                    type="text"
                                    placeholder="Enter number"
                                    className={!phone || (phone && !validNumber) ? "border-danger-subtle shadow-none" : "border-info"}
                                    autoComplete="off"
                                    onChange={(e) => handleInputChange(e.target.value, setPhone)}
                                    onFocus={() => setNumberFocus(true)}
                                    onBlur={() => setNumberFocus(false)}
                                />
                                <span
                                    className={numberFocus && phone && !validNumber ? "custom-invalid " : "d-none"}>
                                        Number is not valid
                                        </span>
                            </div>

                            <div className="m-3 col-11 col-md-5">
                                <Label for="photoInput">Photo: </Label>
                                <Input
                                    id="photoInput"
                                    type="file"
                                    onChange={(e) => {
                                        if (e.target.files) handleInputChange(e.target.files[0], setImage)
                                    }}
                                />
                                <span className={!validImage ? "custom-invalid" : "d-none"}>
                                            Image is not valid
                                        </span>
                            </div>
                        </div>

                        <Button
                            disabled={!validName || !validSurname || !validPassword || !validEmail || !validNumber || !validImage}
                            className="btn btn-info w-50 m-3">Sign Up</Button>
                    </Form>

                </section>
            }
        </>
};

export default Register;