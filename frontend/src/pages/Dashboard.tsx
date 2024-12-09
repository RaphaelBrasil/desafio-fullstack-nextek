import React, { useEffect, useState } from "react";
import { getTasks, updateTask, deleteTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

Modal.setAppElement("#root");

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
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

  const handleSelectTask = (taskId: number) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedTasks.map((taskId) => deleteTask(taskId)));
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !selectedTasks.includes(task.id))
      );
      setSelectedTasks([]);
    } catch (error) {
      alert(`Erro ao deletar tarefas. ${error}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async () => {
    if (taskToEdit) {
      try {
        await updateTask(
          taskToEdit.id,
          taskToEdit.title,
          taskToEdit.description,
          taskToEdit.status
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskToEdit.id ? taskToEdit : task
          )
        );
        setIsModalOpen(false);
      } catch (error) {
        alert(`Erro ao atualizar tarefa. ${error}`);
      }
    }
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) => filter === "all" || task.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <img
        src="/logo.png"
        alt="Logo"
        className="mx-auto mb-6 w-64 bg-gray-800 p-2 rounded"
      />
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="w-1/2 p-2 border rounded"
          placeholder="Pesquisar tarefas"
          value={search}
          onChange={handleSearchChange}
        />
        <select
          className="ml-4 p-2 border rounded"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="all">Todos</option>
          <option value="completed">Concluídas</option>
          <option value="pending">Pendentes</option>
        </select>
        <button
          className="ml-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          onClick={handleDeleteSelected}
        >
          Deletar Selecionadas
        </button>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center">Nenhuma tarefa encontrada.</div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleSelectTask(task.id)}
                  />
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                  <p className="mt-2">{task.description}</p>
                  <p className="mt-2 text-gray-600">Status: {task.status}</p>
                </div>
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => handleEditClick(task)}
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Editar Tarefa"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-xl font-semibold mb-4">Editar Tarefa</h2>
        {taskToEdit && (
          <div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="title"
              >
                Título
              </label>
              <input
                id="title"
                type="text"
                className="w-full border p-2 rounded"
                value={taskToEdit.title}
                onChange={(e) =>
                  setTaskToEdit({ ...taskToEdit, title: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="description"
              >
                Descrição
              </label>
              <textarea
                id="description"
                className="w-full border p-2 rounded"
                value={taskToEdit.description}
                onChange={(e) =>
                  setTaskToEdit({ ...taskToEdit, description: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full border p-2 rounded"
                value={taskToEdit.status}
                onChange={(e) =>
                  setTaskToEdit({ ...taskToEdit, status: e.target.value })
                }
              >
                <option value="pending">Pendente</option>
                <option value="completed">Concluída</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={handleSaveTask}
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
