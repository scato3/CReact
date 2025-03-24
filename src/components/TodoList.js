import { createElement, useEffect, useState } from "../vdom.js";
import { TodoItem } from "./TodoItem.js";

// 할 일 목록 컴포넌트
export function TodoList() {
  // 할 일 목록 상태
  const [todos, setTodos] = useState([
    { id: 1, text: "가상 DOM 구현하기", completed: true },
    { id: 2, text: "컴포넌트 만들기", completed: false },
    { id: 3, text: "상태 관리 추가하기", completed: false },
  ]);

  // 새 할 일 입력 상태
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    console.log("todos 변경됨", todos);
  }, [todos]);

  // 할 일 추가 함수
  function handleAdd() {
    if (newTodo.trim() === "") {
      return;
    }

    // 함수형 업데이트로 상태 변경
    setTodos((prevTodos) => {
      // 새 ID 생성
      const newId =
        prevTodos.length > 0
          ? Math.max(...prevTodos.map((todo) => todo.id)) + 1
          : 1;

      // 새 할 일 목록 생성
      const newTodos = [
        ...prevTodos,
        { id: newId, text: newTodo, completed: false },
      ];

      console.log("todo", newTodos);

      return newTodos;
    });

    // 입력창 초기화
    setNewTodo("");
  }

  // 할 일 삭제 함수
  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // 할 일 완료 토글 함수
  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 입력 변경 핸들러
  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleAddClick = (e) => {
    handleAdd();
  };

  return createElement(
    "div",
    { className: "todo-list-container" },
    createElement("h2", {}, "할 일 목록"),
    createElement(
      "div",
      {
        className: "todo-input-container",
        style: {
          display: "flex",
          marginBottom: "15px",
        },
      },
      createElement("input", {
        type: "text",
        value: newTodo,
        onChange: handleInputChange,
        onKeyDown: handleKeyDown,
        placeholder: "할 일을 입력하세요",
        style: {
          flex: "1",
          padding: "8px",
          borderRadius: "4px 0 0 4px",
          border: "1px solid #ddd",
          fontSize: "16px",
        },
      }),
      createElement(
        "div",
        {
          onClick: handleAdd,
          className: "add-button",
          style: {
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "0 4px 4px 0",
            padding: "0 15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          },
        },
        "추가"
      )
    ),
    createElement(
      "ul",
      {
        className: "todo-items",
        style: {
          listStyleType: "none",
          padding: "0",
          margin: "0",
        },
      },
      ...todos.map((todo) =>
        createElement(TodoItem, {
          key: todo.id,
          text: todo.text,
          completed: todo.completed,
          onToggle: () => toggleTodo(todo.id),
          onDelete: () => deleteTodo(todo.id),
        })
      )
    )
  );
}
