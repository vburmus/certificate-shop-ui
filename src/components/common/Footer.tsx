import React from 'react';
import "styles/css/Footer.css"
import {Image} from "react-bootstrap";

const Footer = () => {
    return (
        <footer id="sticky-footer" className="py-4 bg-white text-white-50 shadow">
            <div className="container text-center text-dark d-flex align-items-center gap-2 justify-content-center">
                <div className="image-container-50">
                    <Image src="/logo.png" className="scaled-image" alt="image"/>
                </div>
                <small>Copyright &copy; Voucher Versa</small>
            </div>
        </footer>
    );
};

export default Footer;