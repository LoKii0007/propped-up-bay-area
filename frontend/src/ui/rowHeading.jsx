import React, { useState, useEffect } from 'react';

function RowHeading({ text, setFilteredData, data, filterValue }) {
    const [isAscending, setIsAscending] = useState(true);

    //  ?---------------------------
    //  ? filter - sorting 
    //  ?---------------------------
    const handleSort = () => {
        setIsAscending(!isAscending)
    }

    useEffect(() => {
        console.log(isAscending)
        const sortedData = [...data].sort((a, b) => {
            const valA = a[filterValue]?.toLowerCase() || ''
            const valB = b[filterValue]?.toLowerCase() || ''

            return isAscending
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA)
        });

        setFilteredData(sortedData) // Update the sorted data in parent
    }, [isAscending])

    return (
        <div className="py-4 row-heading flex items-center gap-4">
            {text}
            <button className="filter-icon hover:bg-gray-200 rotate-90 px-1 py-3 rounded-sm " onClick={handleSort}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5" />
                </svg>
            </button>
        </div>
    );
}

export default RowHeading;
