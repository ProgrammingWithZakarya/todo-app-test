import  axiosInstance  from "./axios";

const useTodo = () => {
  const getTodos = async () => {
    const response = await axiosInstance.get("/todos");
    return response.data;
  };

  const addTodo = async (text: string) => {
    const response = await axiosInstance.post("/todos", { text });
    return response.data;
  };

  const deleteTodo = async (id: string) => {
    const response = await axiosInstance.delete(`/todos/${id}`);
    return response.data;
  };

  const updateTodo = async (id: string, text: string) => {
    const response = await axiosInstance.put(`/todos/${id}`, { text });
    return response.data;
  };

  const toggleTodo = async (id: string) => {
    const response = await axiosInstance.patch(`/todos/${id}`);
    return response.data;
  };

  return { getTodos, addTodo, deleteTodo, updateTodo, toggleTodo };
};

export default useTodo;
