import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const EditTask: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          ` http://localhost:3000/tasks/${taskId}`
        );
        setTask(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Erro ao buscar tarefa:", error);
        alert("Erro ao buscar tarefa");
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdate = async () => {
    try {
      await axios.patch(` http://localhost:3000/tasks/${taskId}`, {
        title,
        description,
        status,
      });
      alert("Tarefa atualizada com sucesso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Erro ao atualizar tarefa");
    }
  };

  if (!task) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Editar Tarefa</h1>
      <div className="bg-white p-8 rounded shadow">
        <input
          type="text"
          placeholder="Título"
          className="w-full border rounded p-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          className="w-full border rounded p-2 mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Status"
          className="w-full border rounded p-2 mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          onClick={handleUpdate}
        >
          Atualizar
        </button>
      </div>
    </div>
  );
};

export default EditTask;
