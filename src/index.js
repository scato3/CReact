import { setApp, initApp } from "./vdom.js";
import { App } from "./components/App.js";

// 앱 컴포넌트 설정
setApp(App);

// DOM이 로드된 후 앱 초기화
window.addEventListener("DOMContentLoaded", () => {
  try {
    initApp();
  } catch (error) {
    console.error("앱 초기화 오류:", error);
  }
});
