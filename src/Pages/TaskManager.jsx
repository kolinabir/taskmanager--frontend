import React, { useState } from "react";
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
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            Error loading tasks. Please try again later.
          </span>
        </div>
      </div>
    );
  }

  const tasks = tasksData?.data || [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Task Management
      </h1>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setCurrentTask({ title: "", description: "" });
            setIsAddModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {task.title}
              </h2>
              <p className="text-gray-600 mb-4">{task.description}</p>
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setCurrentTask(task);
                      setIsEditModalOpen(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-700 p-1 rounded-full hover:bg-yellow-100 transition duration-300"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={() => handleStatusChange(task)}
                  className={`flex items-center px-3 py-1 rounded-full font-medium ${
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
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
