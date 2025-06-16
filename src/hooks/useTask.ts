import axiosInstance from "../axios";

export const TaskStatus = {
  PENDING: 0,
  RUNNING: 1,
  DONE: 2,
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export type Task = {
  assignee_id: number;
  id: number;
  status: TaskStatus;
  title: string;
  description: string;
};

const useTasks = () => {
  const getTasks = async () => {
    const response = await axiosInstance.get<Omit<Task, "description">[]>(
      "/tasks"
    );
    return response.data;
  };

  const addTask = async (task: Omit<Task, "id">) => {
    const response = await axiosInstance.post("/tasks", task);
    return response.data;
  };

  const deleteTask = async (id: string | number) => {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  };

  const updateTask = async (id: string, task: Omit<Task, "id">) => {
    const response = await axiosInstance.put(`/tasks/${id}`, task);
    return response.data;
  };

  return { getTasks, addTask, deleteTask, updateTask };
};

export default useTasks;
