"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [filter, setFilter] = useState("all"); 
    const router = useRouter();

    const fetchTasks = useCallback(async () => {
        let endpoint = "/tasks?limit=50";
        if (filter !== "all") {
            endpoint += `&completed=${filter}`;
        }
        
        const res = await apiRequest(endpoint);
        if (res.ok) {
            const data = await res.json();
            setTasks(data);
        }
    }, [filter]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            fetchTasks();
        }
    }, [fetchTasks, router]);

    const addTask = async (e) => {
        e.preventDefault();
        const res = await apiRequest("/tasks", "POST", { title, description });
        if (res.ok) {
            setTitle("");
            setDescription("");
            fetchTasks();
        }
    };

    const toggleTask = async (id, currentStatus) => {
        const res = await apiRequest(`/tasks/${id}`, "PUT", { completed: !currentStatus });
        if (res.ok) fetchTasks();
    };

    const deleteTask = async (id) => {
        if (confirm("Delete this task?")) {
            const res = await apiRequest(`/tasks/${id}`, "DELETE");
            if (res.ok) fetchTasks();
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Tasks</h1>
                    <button onClick={logout} className="text-red-500 font-semibold">Logout</button>
                </div>

                <form onSubmit={addTask} className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="grid gap-4">
                        <input 
                            type="text" placeholder="Task Title" value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-2 border rounded w-full" required
                        />
                        <textarea 
                            placeholder="Description (Optional)" value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-2 border rounded w-full"
                        />
                        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                            + Add Task
                        </button>
                    </div>
                </form>

                <div className="flex gap-4 mb-6">
                    <button onClick={() => setFilter("all")} className={`px-4 py-1 rounded ${filter === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}`}>All</button>
                    <button onClick={() => setFilter("true")} className={`px-4 py-1 rounded ${filter === 'true' ? 'bg-green-100 text-green-600' : 'bg-gray-200'}`}>Completed</button>
                    <button onClick={() => setFilter("false")} className={`px-4 py-1 rounded ${filter === 'false' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200'}`}>Pending</button>
                </div>

                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <div className="flex-1">
                                <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                                <p className="text-sm text-gray-600">{task.description}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => toggleTask(task.id, task.completed)} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">
                                    {task.completed ? "Undo" : "Complete"}
                                </button>
                                <button onClick={() => deleteTask(task.id)} className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded hover:bg-red-100">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && <p className="text-center text-gray-500 py-10">No tasks found. Start by adding one!</p>}
                </div>
            </div>
        </div>
    );
}