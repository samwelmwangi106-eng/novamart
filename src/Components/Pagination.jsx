function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="d-flex justify-content-center mt-4 gap-2">

      <button
        className="btn btn-outline-primary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => (
          <button
            key={index}
            className={
              currentPage === index + 1
                ? "btn btn-primary"
                : "btn btn-outline-primary"
            }
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        )
      )}

      <button
        className="btn btn-outline-primary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;