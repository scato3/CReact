import { createElement, useState } from "../vdom.js";

// 카운터 컴포넌트
export function Counter() {
  // 상태 정의
  const [count, setCount] = useState(0);

  // 카운터 증가 함수
  const increment = () => {
    setCount(count + 1);
  };

  // 카운터 감소 함수
  const decrement = () => {
    setCount(count - 1);
  };

  // 컴포넌트 UI 반환
  return createElement(
    "div",
    { className: "counter-container" },
    createElement("h2", {}, "카운터 앱"),
    createElement("p", {}, `현재 카운트: ${count}`),
    createElement(
      "div",
      { className: "button-container" },
      createElement(
        "button",
        {
          onClick: decrement,
          className: "button button-decrement",
        },
        "감소"
      ),
      createElement(
        "button",
        {
          onClick: increment,
          className: "button button-increment",
        },
        "증가"
      )
    )
  );
}
