import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://task-management-backend-six-sigma.vercel.app/",
  }),
  tagTypes: ["Task"],
  endpoints: (build) => ({
    getTasks: build.query({
      query: () => "tasks",
      providesTags: ["Task"],
    }),
    getSingleTask: build.query({
      query: (id) => `tasks/${id}`,
      providesTags: ["Task"],
    }),
    addTask: build.mutation({
      query: (body) => ({
        url: "tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: build.mutation({
      query: ({ id, ...body }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: build.mutation({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetSingleTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = api;
