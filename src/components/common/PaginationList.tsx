import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button} from "reactstrap";

interface PaginationListProps {
    currentPage: number,
    currentSize: number,
    totalPages: number,
    totalElems: number
}

const PaginationList: React.FC<PaginationListProps> = ({totalPages, currentPage, currentSize, totalElems}) => {
    const navigate = useNavigate()
    const handlePageChange = (newPage: number) => {
        const queryParameters = new URLSearchParams(window.location.search);
        queryParameters.set('page', newPage.toString());
        queryParameters.set('size', currentSize.toString());

        const updatedQuery = queryParameters.toString();
        navigate(`?${updatedQuery}`, {replace: false});
    };
    const handleSizeChange = (newSize: number) => {
        const queryParameters = new URLSearchParams(window.location.search);
        queryParameters.set('page', "1");
        queryParameters.set('size', newSize.toString());

        const updatedQuery = queryParameters.toString();
        navigate(`?${updatedQuery}`, {replace: false});
    };

    const sizeSelect = totalPages > currentPage && <div className="px-2">
        <select className="form-select bg-info border-info shadow" value={currentSize}
                onChange={(e) => handleSizeChange(parseInt(e.target.value))}>
            {totalElems >= 4 && <option>4</option>}
            {totalElems >= 8 && <option>8</option>}
            {totalElems >= 12 && <option>12</option>}
            {totalElems >= 16 && <option>16</option>}
            {totalElems >= 20 && <option>20</option>}

        </select>
    </div>

    return <div className="w-100 d-flex justify-content-center align-items-center py-3">
        {totalPages > 1 ?
            <ul className="pagination">
                {currentPage !== 1 && <Button className="btn btn-info shadow" onClick={() => handlePageChange(1)}>
                    1
                </Button>}
                {currentPage > 4 && <Button className="btn btn-info border-dark disabled ">
                    ...
                </Button>}
                {currentPage > 3 &&
                    <Button className="btn btn-info shadow" onClick={() => handlePageChange(currentPage - 2)}>
                        {currentPage - 2}
                    </Button>
                }
                {currentPage > 2 &&
                    <Button className="btn btn-info shadow" onClick={() => handlePageChange(currentPage - 1)}>
                        {currentPage - 1}
                    </Button>}
                <Button className="btn btn-info border-dark disabled">
                    {currentPage}
                </Button>

                {totalPages - currentPage > 1 &&
                    <Button className="btn btn-info shadow" onClick={() => handlePageChange(currentPage + 1)}>
                        {currentPage + 1}
                    </Button>}
                {totalPages - currentPage >= 3 &&
                    <Button className="btn btn-info shadow" onClick={() => handlePageChange(currentPage + 2)}>
                        {currentPage + 2}
                    </Button>}
                {totalPages - currentPage >= 4 &&
                    <Button className="btn btn-info border-dark disabled">
                        ...
                    </Button>
                }
                {currentPage !== totalPages &&
                    <Button className="btn btn-info shadow" onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </Button>}
                {sizeSelect}
            </ul>
            :
            <>{sizeSelect}</>
        }
    </div>
};

export default PaginationList;