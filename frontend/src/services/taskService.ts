import api from "./api";

export const getTasks = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get("/tasks", {
      params: { page, limit },
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    throw error;
  }
};

export const createTask = async (title: string, description: string) => {
  try {
    const response = await api.post(
      "/tasks",
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    throw error;
  }
};

export const updateTask = async (
  taskId: number,
  title?: string,
  description?: string,
  status?: string
) => {
  try {
    const response = await api.patch(
      `/tasks/${taskId}`,
      { title, description, status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: number) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    throw error;
  }
};
