import React from 'react';

const Loader = () => {
    return (
        <div >
            <div className="d-flex justify-content-center p-5" >
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;