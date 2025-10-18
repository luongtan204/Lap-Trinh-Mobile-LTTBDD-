import React, { createContext, useContext, useState, ReactNode } from "react";

export type Task = {
  id: string;
  title: string;
  done?: boolean;
};

type ContextType = {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  editTask: (id: string, title: string) => void;
  removeTask: (id: string) => void;
};

const TaskContext = createContext<ContextType | undefined>(undefined);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "To check email", done: false },
    { id: "2", title: "UI task web page", done: false },
    { id: "3", title: "Learn javascript basic", done: false },
    { id: "4", title: "Learn HTML Advance", done: false },
    { id: "5", title: "Medical App UI", done: false },
    { id: "6", title: "Learn Java", done: false },
  ]);

  const addTask = (title: string) =>
    setTasks((t) => [{ id: Date.now().toString(), title, done: false }, ...t]);

  const toggleTask = (id: string) =>
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));

  const editTask = (id: string, title: string) =>
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, title } : task)));

  const removeTask = (id: string) => setTasks((t) => t.filter((task) => task.id !== id));

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, editTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};