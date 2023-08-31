import React from 'react';
import {PageItem} from 'react-bootstrap';
import { useNavigate} from "react-router-dom";

interface PaginationListProps {
    currentPage: number,
    currentSize:number,
    totalPages: number
}

const PaginationList: React.FC<PaginationListProps> = ({totalPages, currentPage,currentSize}) => {
    const navigate = useNavigate()
    const handlePageChange = (newPage: number) => {
        const queryParameters = new URLSearchParams(window.location.search);
        queryParameters.set('page', newPage.toString());
        queryParameters.set('size', currentSize.toString());

        const updatedQuery = queryParameters.toString();
        navigate(`?${updatedQuery}`, { replace: false });
    };
    const handleSizeChange = (newSize: number) => {
        const queryParameters = new URLSearchParams(window.location.search);
        queryParameters.set('page', currentPage.toString());
        queryParameters.set('size', newSize.toString());

        const updatedQuery = queryParameters.toString();
        navigate(`?${updatedQuery}`, { replace: false });
    };

    const sizeSelect = <div className="p-2">
        <select className="form-select" value={currentSize} onChange={(e) =>handleSizeChange(parseInt(e.target.value))} >
            <option>5</option>
            <option>10</option>
            <option>20</option>
            <option>50</option>
        </select>
    </div>

    return (totalPages > 1 ?
            <nav >
                <ul className="pagination">
                    {currentPage > 1 && <PageItem onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </PageItem>
                    }
                    {currentPage !== 1 && <PageItem onClick={() => handlePageChange(1)}>
                        1
                    </PageItem>}
                    {currentPage > 4 && <PageItem className="disabled">
                        ...
                    </PageItem>}
                    {currentPage > 3 &&
                        <PageItem onClick={() => handlePageChange(currentPage - 2)}>
                            {currentPage - 2}
                        </PageItem>
                    }
                    {currentPage > 2 && <PageItem onClick={() => handlePageChange(currentPage - 1)}>
                        {currentPage - 1}
                    </PageItem>}
                    <PageItem className="disabled">
                        {currentPage}
                    </PageItem>

                    {totalPages - currentPage > 1 && <PageItem onClick={() => handlePageChange(currentPage + 1)}>
                        {currentPage + 1}
                    </PageItem>}
                    {totalPages - currentPage >= 3 && <PageItem onClick={() => handlePageChange(currentPage + 1)}>
                        {currentPage + 2}
                    </PageItem>}
                    {totalPages - currentPage >= 4 &&
                        <PageItem className="disabled">
                            ...
                        </PageItem>
                    }
                    {currentPage !== totalPages && <PageItem onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </PageItem>}
                    {currentPage < totalPages && <PageItem onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </PageItem>}
                    {sizeSelect}
                </ul>
            </nav>
       :
            <>{sizeSelect}</>
    );
};

export default PaginationList;