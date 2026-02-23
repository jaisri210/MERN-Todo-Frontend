import { useState, useEffect } from "react";
import axios from "axios";

const Todo = () => {
  const API_URL = "https://mern-todo-backend-hi74.onrender.com/todos";
  const [input, setInput] = useState("");
  const [addTask, setAddTask] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getreq = await axios.get(API_URL);
        setAddTask(getreq.data);
      } catch (err) {
        console.log("getreq:", err);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      if (input.trim() === "") return;
      const postreq = await axios.post(API_URL, {
        text: input,
        checked: false,
      });
      setAddTask([...addTask, postreq.data]);
      setInput("");
    } catch (err) {
      console.log("postreq:", err);
    }
  };

  const handleEdit = (id, text) => {
    setEditId(id);
    setInput(text);
  };

  const handleSave = async () => {
    try {
      const updatereq = await axios.put(`${API_URL}/${editId}`, {
        text: input,
      });
      const editedTask = addTask.map((task) =>
        task._id === editId ? { ...task, text: updatereq.data.text } : task,
      );
      setAddTask(editedTask);
      setEditId(null);
      setInput("");
    } catch (err) {
      console.log("updatereq:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAddTask(addTask.filter((task) => task._id !== id));
    } catch (err) {
      console.log("delreq:", err);
    }
  };

  const handleChecked = async (id, currentCheckedStatus) => {
    try {
      const newStatus = !currentCheckedStatus;

      // Hardcoded URL test
      await axios.put(
        `https://mern-todo-backend-hi74.onrender.com/todos/${id}`,
        {
          checked: newStatus,
        },
      );

      setAddTask((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, checked: newStatus } : task,
        ),
      );
    } catch (err) {
      console.error("Update failed:", err.response?.status, err.message);
    }
  };
  const completedTasks = addTask.filter((task) => task.checked).length;
  const remainingTasks = addTask.filter((task) => !task.checked).length;
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-2 sm:py-10 sm:px-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
          My Tasks
        </h1>
        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button
            onClick={editId ? handleSave : handleAdd}
            className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded-lg font-semibold text-white transition-colors ${
              editId ? "bg-green-500" : "bg-blue-500"
            }`}
          >
            {editId ? "Save" : "Add"}
          </button>
        </div>
        {/* List Section*/}
        <div className="space-y-3">
          {addTask.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer accent-blue-500 flex-shrink-0"
                  checked={task.checked}
                  onChange={() => handleChecked(task._id, task.checked)}
                />
                <span
                  className={`text-gray-700 truncate ${task.checked ? "line-through text-gray-400" : ""}`}
                >
                  {task.text}
                </span>
              </div>
              <div className="flex gap-3 ml-2">
                <button
                  onClick={() => handleEdit(task._id, task.text)}
                  className="text-blue-500 text-sm font-medium p-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500 text-sm font-medium p-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Stats Section */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between text-sm font-medium text-gray-500">
          <div className="text-center">
            <p className="text-gray-800 text-lg">{addTask.length}</p>
            <p>Total</p>
          </div>
          <div className="text-center">
            <p className="text-green-600 text-lg">{completedTasks}</p>
            <p>Done</p>
          </div>
          <div className="text-center">
            <p className="text-orange-500 text-lg">{remainingTasks}</p>
            <p>Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
