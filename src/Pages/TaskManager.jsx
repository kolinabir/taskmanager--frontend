import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "@heroicons/react/solid";
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
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading tasks
      </div>
    );
  }

  const tasks = tasksData?.data || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Management</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setCurrentTask({ title: "", description: "" });
            setIsAddModalOpen(true);
          }}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
            <p className="text-gray-600 mb-4">{task.description}</p>
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setCurrentTask(task);
                    setIsEditModalOpen(true);
                  }}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => handleStatusChange(task)}
                className={`flex items-center ${
                  task.status === "completed"
                    ? "text-green-500"
                    : "text-gray-500"
                } hover:text-opacity-80`}
              >
                {task.status === "completed" ? (
                  <CheckIcon className="h-5 w-5 mr-1" />
                ) : (
                  <XIcon className="h-5 w-5 mr-1" />
                )}
                {task.status === "completed" ? "Completed" : "Pending"}
              </button>
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
        setCurrentTask={setCurrentTask} // Pass setCurrentTask to TaskModal
      />

      <TaskModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        task={currentTask}
        isEditing={true}
        handleSubmit={handleSubmit}
        setCurrentTask={setCurrentTask} // Pass setCurrentTask to TaskModal
      />
    </div>
  );
};

export default TaskManager;
