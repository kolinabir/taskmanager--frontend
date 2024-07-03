import React from "react";
import "./App.css";
import { useGetTasksQuery } from "./api/api";

function App() {
  const { data, error, isLoading } = useGetTasksQuery();
  console.log(data, error, isLoading);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>This is a Vite + React app!</h1>
      <ul>
        {data && data.data.map((task) => <li key={task.id}>{task.title}</li>)}
      </ul>
    </div>
  );
}

export default App;
