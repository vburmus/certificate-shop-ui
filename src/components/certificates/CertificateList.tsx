import CertificateCard from "./CertificateCard";
import {Certificate} from "../../utils/types";
import React from "react";

interface CertificateListProps {
    certificates: Certificate[]
}

const CertificateList: React.FC<CertificateListProps> = ({certificates}) => {
    return (
        <>
            {certificates.map((certificate: Certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate}/>
            ))}
        </>
    );
};

export default CertificateList;