// 가상 DOM 요소 생성 함수
export function createElement(type, props, ...children) {
  // children을 평탄화하고 null/undefined 값 제거
  const flatChildren = children
    .flat()
    .filter((child) => child !== null && child !== undefined);

  return {
    type,
    props: props || {},
    children: flatChildren,
  };
}

// 상태 관리를 위한 변수들
let currentComponent = null;
let states = {};
let stateIndex = 0;

// 이벤트 핸들러 캐시
const eventHandlerCache = new Map();

// 렌더링 상태 관리
let isRendering = false;
let updateQueued = false;

// 앱 컴포넌트를 저장할 변수
let App = null;

// 앱 컴포넌트 설정 함수
export function setApp(component) {
  App = component;
}

// 앱 컴포넌트 반환 함수
export function getApp() {
  return App;
}

// 전체 앱 다시 렌더링
function rerender() {
  // 이미 렌더링 중이면 큐에 추가하고 나중에 다시 시도
  if (isRendering) {
    updateQueued = true;
    return;
  }

  // 큐에 업데이트가 없으면 종료
  if (!updateQueued) {
    return;
  }

  isRendering = true;
  updateQueued = false;

  const rootElement = document.getElementById("root");
  if (!rootElement || !App) {
    isRendering = false;
    return;
  }

  try {
    // 기존 내용 지우기
    rootElement.innerHTML = "";
    // 앱 다시 렌더링
    render(createElement(App, {}), rootElement);
  } catch (error) {
    console.error("렌더링 오류:", error);
  }

  isRendering = false;

  // 대기 중인 업데이트가 있으면 다시 렌더링
  if (updateQueued) {
    rerender();
  }
}

// 업데이트 큐에 추가
function queueUpdate() {
  // 이미 업데이트가 예약되어 있지 않으면 설정
  if (!updateQueued) {
    updateQueued = true;

    rerender();
  }
}

// 컴포넌트 렌더링 함수
export function render(vNode, container) {
  if (!vNode) return;

  // 텍스트 노드 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    const textNode = document.createTextNode(vNode);
    container.appendChild(textNode);
    return textNode;
  }

  // 컴포넌트 함수 처리
  if (typeof vNode.type === "function") {
    const prevComponent = currentComponent;
    const prevStateIndex = stateIndex;

    // 현재 컴포넌트 설정
    currentComponent = vNode.type;
    stateIndex = 0;

    // 컴포넌트 함수 실행하여 자식 노드 얻기
    const childNode = vNode.type(vNode.props);

    // 상태 인덱스 및 현재 컴포넌트 복원
    stateIndex = prevStateIndex;
    currentComponent = prevComponent;

    // 자식 노드 렌더링
    return render(childNode, container);
  }

  // HTML 요소 생성
  const element = document.createElement(vNode.type);

  // 고유 ID 생성 (이벤트 캐싱용)
  const elementId = Math.random().toString(36).substring(2, 9);
  element.dataset.vdomId = elementId;

  // 속성 설정
  if (vNode.props) {
    Object.entries(vNode.props).forEach(([name, value]) => {
      // 이벤트 핸들러 처리
      if (name.startsWith("on") && typeof value === "function") {
        const eventName = name.slice(2).toLowerCase();
        const handlerKey = `${elementId}:${eventName}`;

        // 기존 핸들러가 있으면 제거
        if (eventHandlerCache.has(handlerKey)) {
          element.removeEventListener(
            eventName,
            eventHandlerCache.get(handlerKey)
          );
          eventHandlerCache.delete(handlerKey);
        }

        // 이벤트 핸들러 래핑
        const handler = (event) => {
          // 이벤트 핸들러 호출
          value(event);
        };

        // 핸들러 캐시에 저장 및 이벤트 리스너 추가
        eventHandlerCache.set(handlerKey, handler);
        element.addEventListener(eventName, handler);
      }
      // 클래스 속성 처리
      else if (name === "className") {
        element.setAttribute("class", value);
      }
      // 스타일 속성 처리
      else if (name === "style" && typeof value === "object") {
        Object.entries(value).forEach(([styleName, styleValue]) => {
          element.style[styleName] = styleValue;
        });
      }
      // 값 속성 처리 (input, textarea 등)
      else if (
        name === "value" &&
        (element.tagName === "INPUT" || element.tagName === "TEXTAREA")
      ) {
        element.value = value;
      }
      // checked 속성 처리
      else if (name === "checked" && element.tagName === "INPUT") {
        element.checked = value;
      }
      // 일반 속성 처리
      else if (name !== "children" && name !== "key") {
        element.setAttribute(name, value);
      }
    });
  }

  // 자식 노드 렌더링
  if (vNode.children) {
    vNode.children.forEach((child) => {
      render(child, element);
    });
  }

  // 컨테이너에 요소 추가
  container.appendChild(element);
  return element;
}

// 상태 관리 함수 (React의 useState 흉내)
export function useState(initialValue) {
  const componentName = currentComponent.name;
  const index = stateIndex++;

  // 컴포넌트의 상태 객체가 없으면 초기화
  if (!states[componentName]) {
    states[componentName] = {};
  }

  // 상태 인덱스 키 생성
  const stateKey = `${index}`;

  // 상태가 초기화되지 않았으면 초기값 설정
  if (states[componentName][stateKey] === undefined) {
    states[componentName][stateKey] = initialValue;
  }

  // 상태 및 업데이트 함수 반환
  const state = states[componentName][stateKey];

  const setState = (newValue) => {
    // 함수형 업데이트 지원
    const nextValue =
      typeof newValue === "function"
        ? newValue(states[componentName][stateKey])
        : newValue;

    // 상태 비교 (값이 같으면 업데이트 하지 않음)
    try {
      const currentStateStr = JSON.stringify(states[componentName][stateKey]);
      const nextStateStr = JSON.stringify(nextValue);

      if (currentStateStr === nextStateStr) return;
    } catch (e) {
      // JSON 변환 오류 시에도 계속 진행
    }

    // 상태 업데이트
    states[componentName][stateKey] = nextValue;

    // 큐에 업데이트 추가
    queueUpdate();
  };

  return [state, setState];
}

// 앱 초기화 함수
export function initApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement || !App) return;

  // 상태 초기화
  states = {};
  stateIndex = 0;
  eventHandlerCache.clear();
  isRendering = false;
  updateQueued = false;

  // 루트 엘리먼트의 내용을 지우고 앱 렌더링
  rootElement.innerHTML = "";
  render(createElement(App, {}), rootElement);
}

// 이펙트 저장을 위한 변수
let effects = {};
let effectIndex = 0;
let effectCleanups = {};

// useEffect 함수 (React의 useEffect 흉내)
export function useEffect(callback, dependencies) {
  const componentName = currentComponent.name;
  const index = effectIndex++;

  // 컴포넌트의 이펙트 객체가 없으면 초기화
  if (!effects[componentName]) {
    effects[componentName] = {};
  }

  // 이펙트 인덱스 키 생성
  const effectKey = `${index}`;

  // 의존성 배열이 변경되었는지 확인
  const prevDeps = effects[componentName][effectKey]?.dependencies;
  const depsChanged =
    !prevDeps ||
    !dependencies ||
    dependencies.length !== prevDeps.length ||
    dependencies.some((dep, i) => dep !== prevDeps[i]);

  // 이펙트 정보 저장
  effects[componentName][effectKey] = {
    callback,
    dependencies,
    cleanup: effects[componentName][effectKey]?.cleanup,
  };

  // 렌더링 후 이펙트 실행을 위한 큐에 추가
  if (depsChanged) {
    // 렌더링 완료 후 이펙트를 실행하기 위해 setTimeout 사용
    setTimeout(() => {
      // 이전 클린업 함수가 있으면 실행
      if (effects[componentName][effectKey]?.cleanup) {
        try {
          effects[componentName][effectKey].cleanup();
        } catch (e) {
          console.error("이펙트 클린업 실행 오류:", e);
        }
      }

      // 새 이펙트 실행 및 클린업 함수 저장
      try {
        const cleanup = callback();
        effects[componentName][effectKey].cleanup = cleanup;
      } catch (e) {
        console.error("이펙트 실행 오류:", e);
      }
    }, 0);
  }
}
