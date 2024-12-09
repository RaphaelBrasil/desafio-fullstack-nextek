import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await register(data.email, data.name, data.password);
      alert("Cadastro realizado com sucesso! Você pode fazer login agora.");
      navigate("/login");
    } catch (error) {
      alert("Erro ao registrar. Verifique suas informações e tente novamente.");
      console.error("Erro de registro:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="p-8 bg-white rounded shadow-lg w-full max-w-md">
        <img
          src="/logo.png"
          alt="Logo"
          className="mx-auto mb-6 w-64 bg-gray-800 p-2 rounded"
        />
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Cadastro
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              className={`w-full border p-2 rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...formRegister("name", {
                required: "O nome é obrigatório",
                minLength: {
                  value: 3,
                  message: "O nome deve ter no mínimo 3 caracteres",
                },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full border p-2 rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...formRegister("email", {
                required: "O email é obrigatório",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Digite um email válido",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              className={`w-full border p-2 rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...formRegister("password", {
                required: "A senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="confirmPassword"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full border p-2 rounded ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              {...formRegister("confirmPassword", {
                required: "A confirmação de senha é obrigatória",
                validate: (value) =>
                  value === watch("password") || "As senhas não coincidem",
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-600"
          >
            Registrar
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-700 hover:underline">
              Faça login aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
