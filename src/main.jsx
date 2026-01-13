import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const API = "https://todo-list-backend-yf30.onrender.com";

function TodoApp() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load todos from MongoDB when page loads
  useEffect(() => {
    fetch(fetch("https://todo-list-backend-yf30.onrender.com/tasks")
  )

      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  // Add todo to MongoDB
  const addTodo = async () => {
    if (!task.trim()) return;

    try {
      const res = await fetch(API + "/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: task }),
      });

      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setTask("");
    } catch (err) {
      console.error("Failed to add:", err);
    }
  };

  // Delete todo from MongoDB
  const deleteTodo = async (id) => {
    try {
      await fetch(API + "/tasks/" + id, {
        method: "DELETE",
      });

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Todo List</h2>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task..."
        />
        <button style={styles.addBtn} onClick={addTodo}>
          Add
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo._id} style={styles.item}>
              {todo.name}
              <button
                style={styles.deleteBtn}
                onClick={() => deleteTodo(todo._id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "#f5f5f5",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addBtn: {
    padding: "8px 15px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "20px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "white",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "5px",
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>
);
