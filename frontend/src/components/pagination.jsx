import React from "react";

function Pagination({
  startPage,
  setStartPage,
  totalPages,
  setTotalPages,
  currentPage,
  setCurrentPage,
  displayCount,
  setDisplayCount,
  filtered,
}) {
  const maxVisiblePages = 5;

  const handleDisplayCount = (e) => {
    setDisplayCount(Number(e.target.value));
    setTotalPages(Math.ceil(filtered.length / Number(e.target.value)));
    setCurrentPage(1); // Reset to first page when changing display count
    setStartPage(1); // Reset page range to the beginning
  };

  const handlePageBtn = (page) => {
    setCurrentPage(page);
  };

  const handlePrevRange = () => {
    if (startPage > 1) {
      setStartPage(Math.max(1, startPage - maxVisiblePages));
      setCurrentPage(startPage - maxVisiblePages);
    }
  };

  const handleNextRange = () => {
    if (startPage + maxVisiblePages <= totalPages) {
      setStartPage(
        Math.min(totalPages - maxVisiblePages + 1, startPage + maxVisiblePages)
      );
      setCurrentPage(startPage + maxVisiblePages);
    }
  };

  return (
    <>
      <div className="pagination flex items-center justify-between px-5 md:px-12 mb-[100px] md:mb-0 ">
        <div className="page-left">
          <label>Show results: </label>
          <input
            min={1}
            value={displayCount}
            onChange={handleDisplayCount}
            type="number"
            className="w-[40px]"
          />
        </div>
        <div className="page-right flex items-center gap-2">
          <button onClick={handlePrevRange} disabled={startPage === 1}>
            {/* <img src="/arrow-left.png" alt="Previous Range" className="px-4 py-3 bg-white" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-chevron-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
              />
            </svg>
          </button>
          <div className="flex">
            {Array.from(
              { length: Math.min(maxVisiblePages, totalPages - startPage + 1) },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageBtn(startPage + index)}
                  className={` text-sm md:text-base rounded-md md:rounded-xl w-8 md:w-10 h-8 md:h-10 ${
                    currentPage === startPage + index ? "bg-[#EAFDF8]" : ""
                  }`}
                >
                  {startPage + index}
                </button>
              )
            )}
            {startPage + maxVisiblePages < totalPages && (
              <div className="mx-2">...</div>
            )}
            {startPage + maxVisiblePages < totalPages && (
              <button
                onClick={() => handlePageBtn(totalPages)}
                className={`rounded-xl w-10 h-10 ${
                  currentPage === totalPages ? "bg-[#EAFDF8]" : ""
                }`}
              >
                {totalPages}
              </button>
            )}
          </div>
          <button
            onClick={handleNextRange}
            disabled={startPage + maxVisiblePages > totalPages}
          >
            {/* <img src="/arrow-right.png" alt="Next Range" className="px-4 py-3 bg-white" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default Pagination;
