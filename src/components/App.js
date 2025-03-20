import { createElement } from "../vdom.js";
import { Counter } from "./Counter.js";
import { TodoList } from "./TodoList.js";

// 메인 앱 컴포넌트
export function App() {
  return createElement(
    "div",
    { className: "app-container" },
    createElement("h1", {}, "가상 DOM 예제"),
    createElement(Counter, {}),
    createElement("hr", {
      style: {
        margin: "30px 0",
        border: "none",
        borderTop: "1px solid #ddd",
      },
    }),
    createElement(TodoList, {})
  );
}
