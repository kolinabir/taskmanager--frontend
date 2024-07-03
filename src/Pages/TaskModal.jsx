import React, { Fragment } from "react";

const TaskModal = ({
  isOpen,
  closeModal,
  task,
  isEditing,
  handleSubmit,
  setCurrentTask,
}) => {
  const handleTitleChange = (e) => {
    setCurrentTask({ ...task, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setCurrentTask({ ...task, description: e.target.value });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-600"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? "Edit Task" : "Add New Task"}
          </h3>
          <form
            onSubmit={(e) => handleSubmit(e, isEditing)}
            className="space-y-4"
          >
            <input
              type="text"
              value={task.title}
              onChange={handleTitleChange}
              placeholder="Title"
              className="w-full px-3 py-2 border rounded mb-4"
              required
            />
            <textarea
              value={task.description}
              onChange={handleDescriptionChange}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded mb-4"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default TaskModal;
