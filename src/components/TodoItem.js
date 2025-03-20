import { createElement } from "../vdom.js";

// 할 일 항목 컴포넌트
export function TodoItem({ text, completed, onToggle, onDelete }) {
  // 토글 핸들러 래핑
  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle();
  };

  // 삭제 핸들러 래핑
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return createElement(
    "li",
    {
      className: `todo-item ${completed ? "completed" : ""}`,
      style: {
        textDecoration: completed ? "line-through" : "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
      },
    },
    createElement(
      "div",
      {
        className: "todo-content",
        style: { display: "flex", alignItems: "center", gap: "8px" },
      },
      createElement("input", {
        type: "checkbox",
        checked: completed,
        onChange: handleToggle,
      }),
      createElement("span", {}, text)
    ),
    createElement(
      "div",
      {
        onClick: handleDelete,
        className: "delete-button",
        style: {
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "4px 8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        },
      },
      "삭제"
    )
  );
}
