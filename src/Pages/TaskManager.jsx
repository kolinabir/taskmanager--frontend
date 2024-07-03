import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "../api/api";
import TaskModal from "./TaskModal";

const TaskManager = () => {
  const { data: tasksData, isLoading, isError } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e, isEditing) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateTask({ id: currentTask._id, ...currentTask }).unwrap();
        setIsEditModalOpen(false);
      } else {
        await addTask(currentTask).unwrap();
        setIsAddModalOpen(false);
      }
      setCurrentTask({ title: "", description: "" });
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDelete = async (id) => {
    if (id) {
      try {
        await deleteTask(id).unwrap();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleStatusChange = async (task) => {
    try {
      await updateTask({
        id: task._id,
        status: task.status === "completed" ? "pending" : "completed",
      }).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-t-4 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            Error loading tasks. Please try again later.
          </span>
        </motion.div>
      </div>
    );
  }

  const tasks = tasksData?.data || [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-12 text-center text-gray-800"
      >
        Task Management
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCurrentTask({ title: "", description: "" });
            setIsAddModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Task
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  {task.title}
                </h2>
                <p className="text-gray-600">{task.description}</p>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setCurrentTask(task);
                        setIsEditModalOpen(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-600 p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition duration-300"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:text-red-600 p-2 rounded-full bg-red-100 hover:bg-red-200 transition duration-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(task)}
                    className={`flex items-center px-4 py-2 rounded-full font-medium ${
                      task.status === "completed"
                        ? "text-green-700 bg-green-100 hover:bg-green-200"
                        : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                    } transition duration-300`}
                  >
                    {task.status === "completed" ? (
                      <CheckIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <XIcon className="h-4 w-4 mr-2" />
                    )}
                    {task.status === "completed" ? "Completed" : "Pending"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <TaskModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        task={currentTask}
        isEditing={false}
        handleSubmit={handleSubmit}
        setCurrentTask={setCurrentTask}
      />

      <TaskModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        task={currentTask}
        isEditing={true}
        handleSubmit={handleSubmit}
        setCurrentTask={setCurrentTask}
      />
    </div>
  );
};

export default TaskManager;
