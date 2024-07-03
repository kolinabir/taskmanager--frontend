/* eslint-disable react/prop-types */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4 sm:mx-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isEditing ? "Edit Task" : "Add New Task"}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </motion.button>
              </div>
              <form
                onSubmit={(e) => handleSubmit(e, isEditing)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-start text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={task.title}
                    onChange={handleTitleChange}
                    placeholder="Enter task title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-start text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={task.description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter task description"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    {isEditing ? "Update" : "Add"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
