import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import {
	createTask,
	getTasks,
	updateTask,
	deleteTask
} from "../services/taskService";

// Improved Task interface with optional id for new tasks
interface Task {
	id?: number;
	title: string;
	description: string;
	status: "pendente" | "concluído";
}

// Set up Modal for the entire application
Modal.setAppElement("#root");

const Dashboard: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [search, setSearch] = useState<string>("");
	const [filter, setFilter] = useState<"todas" | "concluído" | "pendente">(
		"todas"
	);
	const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [currentTask, setCurrentTask] = useState<Task>({
		title: "",
		description: "",
		status: "pendente"
	});

	const navigate = useNavigate();

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await getTasks();
				setTasks(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error loading tasks:", error);
				navigate("/login");
			}
		};

		fetchTasks();
	}, [navigate]);

	const handleSelectTask = (taskId: number) => {
		setSelectedTasks((prev) =>
			prev.includes(taskId)
				? prev.filter((id) => id !== taskId)
				: [...prev, taskId]
		);
	};

	const handleDeleteSelected = async () => {
		try {
			await Promise.all(
				selectedTasks.map((taskId) => deleteTask(taskId))
			);
			setTasks((prev) =>
				prev.filter((task) => !selectedTasks.includes(task.id!))
			);
			setSelectedTasks([]);
		} catch (error) {
			alert(`Error deleting tasks: ${error}`);
		}
	};

	const handleCreateTask = async () => {
		try {
			const newTask = await createTask(
				currentTask.title,
				currentTask.description
			);
			setTasks((prev) => [...prev, newTask]);
			setIsCreateModalOpen(false);
			setCurrentTask({ title: "", description: "", status: "pendente" });
		} catch (error) {
			alert(`Error creating task: ${error}`);
		}
	};

	const handleUpdateTask = async () => {
		if (currentTask.id) {
			try {
				await updateTask(
					currentTask.id,
					currentTask.title,
					currentTask.description,
					currentTask.status
				);
				setTasks((prev) =>
					prev.map((task) =>
						task.id === currentTask.id ? currentTask : task
					)
				);
				setIsEditModalOpen(false);
			} catch (error) {
				alert(`Error updating task: ${error}`);
			}
		}
	};

	const handleEditClick = (task: Task) => {
		setCurrentTask(task);
		setIsEditModalOpen(true);
	};

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		navigate("/login");
	};

	const filteredTasks = tasks
		.filter(
			(task) =>
				task.title.toLowerCase().includes(search.toLowerCase()) ||
				task.description.toLowerCase().includes(search.toLowerCase())
		)
		.filter((task) => filter === "todas" || task.status === filter);

	const modalStyle = {
		content: {
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, -50%)",
			backgroundColor: "#f4f4f4",
			borderRadius: "8px",
			padding: "20px",
			maxWidth: "500px",
			width: "90%"
		},
		overlay: {
			backgroundColor: "rgba(0, 0, 0, 0.5)"
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<img
				src="/logo.png"
				alt="Logo"
				className="mx-auto mb-6 w-64 bg-gray-800 p-2 rounded"
			/>

			<div className="flex flex-wrap justify-between items-center mb-6 space-y-2 md:space-y-0">
				<input
					type="text"
					className="w-full md:w-1/3 p-2 border rounded bg-white text-gray-800"
					placeholder="Pesquisar"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<select
					className="w-full md:w-auto p-2 border rounded bg-white text-gray-800"
					value={filter}
					onChange={(e) =>
						setFilter(
							e.target.value as "todas" | "concluído" | "pendente"
						)
					}
				>
					<option value="todas">Todas</option>
					<option value="concluído">Concluídas</option>
					<option value="pendente">Pendentes</option>
				</select>

				<div className="flex space-x-2">
					{selectedTasks.length === 0 ? (
						<></>
					) : (
						<button
							className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
							onClick={handleDeleteSelected}
							disabled={selectedTasks.length === 0}
						>
							Excluir Selecionadas
						</button>
					)}

					<button
						className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
						onClick={() => setIsCreateModalOpen(true)}
					>
						Nova Tarefa{" "}
					</button>

					<button
						className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			</div>

			{loading ? (
				<div className="text-center text-gray-600">Loading...</div>
			) : (
				<div className="space-y-4">
					{filteredTasks.length === 0 ? (
						<div className="text-center text-gray-600">
							Nenhuma tarefa econtrada
						</div>
					) : (
						filteredTasks.map((task) => (
							<div
								key={task.id}
								className="bg-white p-4 rounded shadow flex justify-between items-center hover:bg-gray-50 transition-colors"
							>
								<div className="flex items-center space-x-4">
									<input
										type="checkbox"
										checked={selectedTasks.includes(
											task.id!
										)}
										onChange={() =>
											handleSelectTask(task.id!)
										}
										className="form-checkbox"
									/>
									<div>
										<h2 className="text-xl font-semibold text-gray-800">
											{task.title}
										</h2>
										<p className="text-gray-600">
											{task.description}
										</p>
										<span
											className={`
                                                inline-block mt-2 px-2 py-1 rounded text-sm
                                                ${
													task.status === "concluído"
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}
                                            `}
										>
											{task.status === "concluído"
												? "Concluído"
												: "Pendente"}
										</span>
									</div>
								</div>
								<button
									className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
									onClick={() => handleEditClick(task)}
								>
									Editar
								</button>
							</div>
						))
					)}
				</div>
			)}

			{/* Edit Task Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onRequestClose={() => setIsEditModalOpen(false)}
				style={modalStyle}
				contentLabel="Editar Tarefa"
			>
				<h2 className="text-2xl font-bold mb-4 text-gray-800">
					Editar Tarefa
				</h2>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="edit-title"
							className="block text-gray-700 mb-2"
						>
							Título
						</label>
						<input
							id="edit-title"
							type="text"
							className="w-full p-2 border rounded bg-white text-gray-800"
							value={currentTask.title}
							onChange={(e) =>
								setCurrentTask((prev) => ({
									...prev,
									title: e.target.value
								}))
							}
						/>
					</div>
					<div>
						<label
							htmlFor="edit-description"
							className="block text-gray-700 mb-2"
						>
							Descrição
						</label>
						<textarea
							id="edit-description"
							className="w-full p-2 border rounded bg-white text-gray-800"
							value={currentTask.description}
							onChange={(e) =>
								setCurrentTask((prev) => ({
									...prev,
									description: e.target.value
								}))
							}
						/>
					</div>
					<div>
						<label
							htmlFor="edit-status"
							className="block text-gray-700 mb-2"
						>
							Status
						</label>
						<select
							id="edit-status"
							className="w-full p-2 border rounded bg-white text-gray-800"
							value={currentTask.status}
							onChange={(e) =>
								setCurrentTask((prev) => ({
									...prev,
									status: e.target.value as
										| "pendente"
										| "concluído"
								}))
							}
						>
							<option value="pendente">Pendente</option>
							<option value="concluído">Concluído</option>
						</select>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
							onClick={() => setIsEditModalOpen(false)}
						>
							Cancelar
						</button>
						<button
							className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
							onClick={handleUpdateTask}
						>
							Salvar
						</button>
					</div>
				</div>
			</Modal>

			{/* Create Task Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				onRequestClose={() => setIsCreateModalOpen(false)}
				style={modalStyle}
				contentLabel="Create New Task"
			>
				<h2 className="text-2xl font-bold mb-4 text-gray-800">
					Nova Tarefa
				</h2>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="new-title"
							className="block text-gray-700 mb-2"
						>
							Título
						</label>
						<input
							id="new-title"
							type="text"
							className="w-full p-2 border rounded bg-white text-gray-800"
							onChange={(e) =>
								setCurrentTask((prev) => ({
									...prev,
									title: e.target.value,
									description: e.target.value
								}))
							}
							placeholder="Título"
						/>
					</div>
					<div>
						<label
							htmlFor="new-description"
							className="block text-gray-700 mb-2"
						>
							Descrição
						</label>
						<textarea
							id="new-description"
							className="w-full p-2 border rounded bg-white text-gray-800"
							onChange={(e) =>
								setCurrentTask((prev) => ({
									...prev,
									description: e.target.value
								}))
							}
						/>
					</div>

					<div className="flex justify-end space-x-2">
						<button
							className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
							onClick={() => setIsCreateModalOpen(false)}
						>
							Cancelar
						</button>
						<button
							className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
							onClick={handleCreateTask}
							disabled={!currentTask.title.trim()}
						>
							Criar Tarefa
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default Dashboard;
