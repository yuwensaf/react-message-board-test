import TodoItem from "./TodoItem";
import { useState, useRef } from "react"; // 用解構的語法

function App() {
  const [value, setValue] = useState("");

  const [todos, setTodos] = useState([
    { id: 1, content: "abc", isFinished: true },
    { id: 2, content: "not done", isFinished: false },
  ]);

  const id = useRef(3);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleButtonClick = () => {
    setTodos([
      {
        id: id.current,
        content: value,
        isFinished: false,
      },
      ...todos,
    ]);
    setValue("");
    id.current++;
  };

  // 刪除 todo
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 切換已完成/未完成
  const handleToggleIsFinished = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id !== id) return todo;
        return {
          ...todo,
          isFinished: !todo.isFinished,
        };
      })
    );
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="add todo"
        value={value}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>Add todo</button>

      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleIsFinished={handleToggleIsFinished}
        />
      ))}
    </div>
  );
}

export default App;
