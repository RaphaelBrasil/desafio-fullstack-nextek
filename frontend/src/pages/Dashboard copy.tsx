import React, { useEffect, useState } from "react";
import {
	getTasks,
	createTask,
	updateTask,
	deleteTask
} from "../services/taskService";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

interface Task {
	id: number;
	title: string;
	description: string;
	status: string;
}

const Dashboard: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [search, setSearch] = useState<string>("");
	const [filter, setFilter] = useState<string>("all");
	const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
	const [newTask, setNewTask] = useState<{
		title: string;
		description: string;
	}>({ title: "", description: "" });
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

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		navigate("/login");
	};

	const handleSelectTask = (taskId: number) => {
		setSelectedTasks((prevSelected) =>
			prevSelected.includes(taskId)
				? prevSelected.filter((id) => id !== taskId)
				: [...prevSelected, taskId]
		);
	};

	const handleDeleteSelected = async () => {
		try {
			await Promise.all(
				selectedTasks.map((taskId) => deleteTask(taskId))
			);
			setTasks((prevTasks) =>
				prevTasks.filter((task) => !selectedTasks.includes(task.id))
			);
			setSelectedTasks([]);
		} catch (error) {
			alert(`Erro ao deletar tarefas. ${error}`);
		}
	};

	const handleCreateTask = async () => {
		try {
			const task = await createTask(newTask.title, newTask.description);
			setTasks([...tasks, task]);
			setNewTask({ title: "", description: "" });
			setIsCreateModalOpen(false);
		} catch (error) {
			alert(`Erro ao criar tarefa. ${error}`);
		}
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
				setIsEditModalOpen(false);
			} catch (error) {
				alert(`Erro ao atualizar tarefa. ${error}`);
			}
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
		setIsEditModalOpen(true);
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
			<div className="flex justify-between items-center mb-6">
				<img src="/logo.png" alt="Logo" className="w-32" />
				<button
					className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
					onClick={handleLogout}
				>
					Logout
				</button>
				<button
					className="ml-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
					onClick={handleDeleteSelected}
				>
					Deletar Selecionadas
				</button>
			</div>

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
					className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					onClick={() => setIsCreateModalOpen(true)}
				>
					Nova Tarefa
				</button>
			</div>

			{loading ? (
				<div>Carregando...</div>
			) : (
				<div className="space-y-4">
					{filteredTasks.length === 0 ? (
						<div className="text-center">
							Nenhuma tarefa encontrada.
						</div>
					) : (
						filteredTasks.map((task) => (
							<div
								key={task.id}
								className="bg-white p-4 rounded shadow flex justify-between items-center"
							>
								<div>
									<input
										type="checkbox"
										checked={selectedTasks.includes(
											task.id
										)}
										onChange={() =>
											handleSelectTask(task.id)
										}
									/>
									<h2 className="text-xl font-semibold">
										{task.title}
									</h2>
									<p className="mt-2">{task.description}</p>
									<p className="mt-2 text-gray-600">
										Status: {task.status}
									</p>
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

			{/* Modal de Edição */}
			<Modal
				open={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
			>
				<Box
					className="absolute top-1/2 left-1/2 bg-white p-6 rounded shadow w-96"
					style={{ transform: "translate(-50%, -50%)" }}
				>
					<h2 className="text-lg font-semibold mb-4">
						Editar Tarefa
					</h2>
					{taskToEdit && (
						<div>
							<input
								type="text"
								value={taskToEdit.title}
								onChange={(e) =>
									setTaskToEdit({
										...taskToEdit,
										title: e.target.value
									})
								}
							/>
							{/* Outros inputs para edição */}
							<button onClick={handleSaveTask}>Salvar</button>
						</div>
					)}
				</Box>
			</Modal>

			{/* Modal de Criação */}
			<Modal
				open={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			>
				<Box
					className="absolute top-1/2 left-1/2 bg-white p-6 rounded shadow w-96"
					style={{ transform: "translate(-50%, -50%)" }}
				>
					<h2 className="text-lg font-semibold mb-4">Nova Tarefa</h2>
					<div className="mb-4">
						<input
							type="text"
							placeholder="Título"
							value={newTask.title}
							onChange={(e) =>
								setNewTask({
									...newTask,
									title: e.target.value
								})
							}
						/>
					</div>
					<button onClick={handleCreateTask}>Criar</button>
				</Box>
			</Modal>
		</div>
	);
};

export default Dashboard;
