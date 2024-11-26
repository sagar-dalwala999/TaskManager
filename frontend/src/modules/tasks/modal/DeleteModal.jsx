// eslint-disable-next-line react/prop-types
const DeleteModal = ({ onClose, mode, handleSubmit }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-base-content">
          {mode === "task" ? "Delete Task" : "Delete Sub Task"}
        </h3>
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block font-semibold text-base-content">
              Are You Sure You Want To Delete{" "}
              {mode === "task" ? "Task" : "Sub Task"}
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleSubmit}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
