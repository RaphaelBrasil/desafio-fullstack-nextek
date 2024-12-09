import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(email, name, password);
      alert("Cadastro realizado com sucesso! Você pode fazer login agora.");
      navigate("/login");
    } catch (error) {
      alert("Erro ao registrar. Verifique suas informações e tente novamente.");
      console.error("Erro de registro:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
        <input
          type="text"
          placeholder="Nome"
          className="w-full border p-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleRegister}
        >
          Registrar
        </button>
      </div>
    </div>
  );
};

export default Register;
