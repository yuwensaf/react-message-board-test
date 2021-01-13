import TodoItem from "./TodoItem";
import useTodos from "./useTodos";
import React, { useMemo, useState, useCallback, useRef } from "react"; // 從 React 引入 memo, useMemo

// Add todo 按鈕
// function Button({ onclick, children }) {
//   console.log("render button");
//   return <button onClick={onclick}>{children}</button>;
// }

// eslint-disable-next-line react/prop-types
function Test({ style }) {
  console.log("test render");
  return <div style={style}>test</div>;
}

const redStyle = {
  color: "red",
};

const blueStyle = {
  color: "blue",
};

// function App() {
//   // 用解構的語法，拿到「從各個 hooks 回傳的東西」
//   const {
//     todos,
//     handleButtonClick,
//     handleDeleteTodo,
//     handleToggleIsFinished,
//     value,
//     handleChange,
//   } = useTodos();

//   const s = useMemo(() => {
//     console.log("calculate s");
//     return value ? redStyle : blueStyle;
//   }, [value]);

//   // UI
//   return (
//     <div className="App">
//       <Test style={s} />
//       <input
//         type="text"
//         placeholder="add todo"
//         value={value}
//         onChange={handleChange}
//       />
//       <button onclick={handleButtonClick}>Add todo</button>
//       {todos.map((todo) => (
//         <TodoItem
//           key={todo.id}
//           todo={todo}
//           handleDeleteTodo={handleDeleteTodo}
//           handleToggleIsFinished={handleToggleIsFinished}
//         />
//       ))}
//     </div>
//   );
// }

export default function App() {
  const todoId = useRef(0);
  console.log(todoId.current);
  const [value, setValue] = useState("");

  const [todos, setTodos] = useState([
    { id: 1, content: "aaa", isChecked: false },
    { id: 2, content: "bbb", isChecked: true },
  ]);

  const [filter, setFilter] = useState("active");

  // 可以從 filter 和 todos 來推算出 filteredTodos，所以 filteredTodos 是 derived state
  const filteredTodos = useMemo(() => {
    console.log("calculate filteredTodos");
    return todos.filter((todo) => {
      if (filter === "all") return true;
      if (filter === "active") return !todo.isChecked;
      if (filter === "completed") return todo.isChecked;
    });
  }, [filter, todos]);

  const handleChange = useCallback(
    (e) => {
      console.log(todos);
      setValue(e.target.value);
    },
    [todos]
  );

  console.log("render~");

  return (
    <div>
      todo: <input value={value} onChange={handleChange} />
      <button
        onClick={() => {
          setTodos([]);
        }}
      >
        清空所有項目
      </button>
      {filteredTodos.map((todo) => (
        <div key={todo.id}>{todo.content}</div>
      ))}
    </div>
  );
}
