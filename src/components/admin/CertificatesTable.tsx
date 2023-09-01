import React, {useState} from 'react';
import {Certificate} from '../../utils/types';
import {Button} from "reactstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import EditingModal from "./EditingModal";
import ConfirmationModal from "./ConfirmationModal";
import {deleteCertificate} from "../../utils/certificateUtils";
import {CaretDownFill, CaretLeft, CaretUpFill} from "react-bootstrap-icons";
import {useSelector} from "react-redux";
import RootState from "../../redux/RootState";

interface CertificatesTableProps {
    certificates: Certificate[],
}

const CertificatesTable: React.FC<CertificatesTableProps> = ({certificates}) => {
        const [isEditing, setIsEditing] = useState(false)
        const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
        const [isDeleting, setIsDeleting] = useState(false)
        const [deletingCertificate, setDeletingCertificate] = useState<Certificate | null>(null)
        const filterState = useSelector((state: RootState) => state.filter)
        const isFiltered = filterState.input || filterState.tags.length
        const location = useLocation()
        const queryParams = new URLSearchParams(location.search);
        const sortParams = queryParams.getAll('sort')
        const navigate = useNavigate()

        const isASC = (sortParam: string) => {
            return sortParam.includes("asc")
        }

        const handleSortByDate = (sortDir: string) => {
            if (sortParams.length === 1) {
                if (sortParams[0].startsWith("name"))
                    navigate(`?sort=date:${sortDir}&sort=${sortParams[0]}`);
                else
                    navigate(`?sort=date:${sortDir}`, {replace: true})
            } else if (sortParams.length > 1) {
                navigate(`?sort=date:${sortDir}&sort=${sortParams[1]}`);
            } else {
                navigate(`?sort=date:${sortDir}`)
            }
        };

        const handleSortByName = (sortDir: string) => {
            if (sortParams.length >= 1) {
                if (sortParams[0].startsWith("date"))
                    navigate(`?sort=${sortParams[0]}&sort=name:${sortDir}`);
                else
                    navigate(`?sort=name:${sortDir}`, {replace: true})
            } else {
                navigate(`?sort=name:${sortDir}`)
            }
        };

        return (
            <>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Date/Time
                            {!isFiltered && (sortParams.length < 1 || sortParams[0].startsWith("name") ?
                                <CaretLeft
                                    onClick={() => handleSortByDate("asc")}/> : (isASC(sortParams[0])) ?
                                    <CaretUpFill onClick={() => handleSortByDate("desc")}/>
                                    :
                                    <CaretDownFill onClick={() => handleSortByDate("asc")}/>)}
                        </th>
                        <th scope="col">Name

                            {!isFiltered && (sortParams.length < 1 || !sortParams.join(" ").includes("name") ?
                                <CaretLeft onClick={() => handleSortByName("asc")}/> :
                                ((sortParams.length === 1) ? (sortParams[0].startsWith("name") && isASC(sortParams[0])) : isASC(sortParams[1])) ?
                                    <CaretUpFill onClick={() => handleSortByName("desc")}/>
                                    :
                                    <CaretDownFill onClick={() => handleSortByName("asc")}/>)}
                        </th>
                        <th scope="col">Tags</th>
                        <th scope="col">Description</th>
                        <th scope="col">Price</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {certificates.map((certificate) => (
                        <tr key={certificate.id}>
                            <td>{certificate.createDate.replace("T", " ")} </td>
                            <td>{certificate.name}</td>
                            <td>{certificate.tags.map(t => t.name).join(', ')}</td>
                            <td>{certificate.shortDescription}</td>
                            <td>{certificate.price}</td>
                            <td className="">
                                <Link className="btn btn-info text-dark" to={`/certificate/${certificate.id}`}>View</Link>
                                <Button className="btn btn-warning" onClick={() => {
                                    setIsEditing(true);
                                    setEditingCertificate(certificate);
                                }}>Edit</Button>
                                <Button className="btn btn-danger m-2" onClick={() => {
                                    setIsDeleting(true);
                                    setDeletingCertificate(certificate);
                                }}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {isEditing && editingCertificate && <EditingModal closeModal={setIsEditing} certificate={editingCertificate}/>}
                {isDeleting && deletingCertificate && <ConfirmationModal closeModal={setIsDeleting} action={() => {
                    deleteCertificate(deletingCertificate.id);
                    window.location.reload()
                }} text={`Deleting certificate with id = ${deletingCertificate.id}`}/>}

            </>
        );
    }
;

export default CertificatesTable;
