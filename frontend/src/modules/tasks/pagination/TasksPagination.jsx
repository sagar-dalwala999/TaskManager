/* eslint-disable react/prop-types */
const TasksPagination = ({ currentPage, setCurrentPage, totalPages }) => {
  // const pageLinks = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (currentPage <= 0) {
    currentPage = 1;
  }

  return (
    <>
      {currentPage >= 1 && (
        <div className={`flex justify-end mt-4 ${totalPages === 1 && "hidden"}`}>
          <div className="btn-group">
            <button
              className={`btn btn-outline btn-sm me-1`}
              disabled={currentPage === 1}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <button className="btn btn-active btn-sm">{currentPage}</button>
            <button
              className="btn btn-outline btn-sm ms-1"
              disabled={currentPage === totalPages}
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TasksPagination;
