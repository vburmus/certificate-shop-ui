import { useState, useEffect } from 'react';
import {getCertificateById} from "../utils/certificateUtils";
import {isAxiosError} from "axios";
import {Certificate} from "../utils/types";

const useGetCertificate = (certificateId:number|null) => {
    const [certificate, setCertificate] = useState<Certificate|null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                setIsLoading(true);
                if (certificateId) {
                    const fetchedCertificate = await getCertificateById(certificateId);
                    setCertificate(fetchedCertificate);
                } else {
                    setError('Please provide an ID');
                }
            } catch (e) {
                if (isAxiosError(e) && e.response) {
                    setError(e.response.data.detail);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCertificate();
    }, [certificateId]);

    return { certificate, error, isLoading ,setError,setIsLoading};
};

export default useGetCertificate;
