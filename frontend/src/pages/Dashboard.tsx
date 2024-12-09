import React, { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data.data);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        navigate("/login");
      }
    };

    fetchTasks();
    setLoading(false);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <img
        src="/logo.png"
        alt="Logo"
        className="mx-auto mb-6 w-64 bg-gray-800 p-2 rounded"
      />
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center">Nenhuma tarefa encontrada.</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="mt-2">{task.description}</p>
                <p className="mt-2 text-gray-600">Status: {task.status}</p>
                <button
                  className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => navigate(`/edit-task/${task.id}`)}
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
