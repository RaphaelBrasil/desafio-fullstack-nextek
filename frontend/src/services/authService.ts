import api from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    // Salva o token de autenticação no localStorage
    localStorage.setItem("authToken", response.data.access_token);
    return response.data;
  } catch (error) {
    console.error("Erro de login:", error);
    throw error;
  }
};

export const register = async (
  email: string,
  name: string,
  password: string
) => {
  try {
    const response = await api.post("/auth/register", {
      email,
      name,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Erro de registro:", error);
    throw error;
  }
};
