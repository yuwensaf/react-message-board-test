import { useState, useEffect, useRef, useCallback } from "react";
import useInput from "./useInput";

function writeTodosToLocalStorage(todos) {
  window.localStorage.setItem("todos", JSON.stringify(todos));
}

export default function useTodos() {
  const id = useRef(1);
  const { value, setValue, handleChange } = useInput();
  const [todos, setTodos] = useState(() => {
    console.log("init");
    let todosData = window.localStorage.getItem("todos") || "";
    if (todosData) {
      todosData = JSON.parse(todosData); // 把 todos 的初始值直接設為「從 localStorage 拿出來的 todos」
      id.current = todosData[0].id + 1; // 把 id 設為「localStorage 裡面最大的 id 再加 1」
    } else {
      todosData = [];
    }
    return todosData;
  });

  // 把 todos 存到 localStorage 裡面去
  useEffect(() => {
    if (!todos) return; // 如果沒有 todos 的話，就直接 return
    writeTodosToLocalStorage(todos);
  }, [todos]);

  // 新增 todo
  const handleButtonClick = useCallback(() => {
    console.log(value);
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
  }, [setTodos, setValue, value, todos]);

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

  return {
    id,
    todos,
    setTodos,
    handleButtonClick,
    handleDeleteTodo,
    handleToggleIsFinished,
    value,
    setValue,
    handleChange,
  };
}
