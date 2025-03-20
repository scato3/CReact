# 가상 DOM 구현 프로젝트

이 프로젝트는 React와 유사한 방식으로 작동하는 간단한 가상 DOM(Virtual DOM) 구현한 예제입니다. 이 라이브러리는 `createElement`, `useState`, `useEffect`와 같은 핵심 React API를 모방하여 구현되어 있습니다.

## 주요 기능

- **가상 DOM 구현**: 실제 DOM 조작을 최소화하는 가상 DOM 시스템
- **컴포넌트 기반 아키텍처**: 재사용 가능한 컴포넌트 생성 지원
- **상태 관리**: useState를 통한 컴포넌트 상태 관리
- **사이드 이펙트 처리**: useEffect를 통한 생명주기 및 부수 효과 관리
- **예제 애플리케이션**: 할 일 목록(TodoList) 구현

## 구조

```
src/
├── vdom.js             # 가상 DOM 구현 및 핵심 기능 (createElement, useState, useEffect)
├── components/
│   ├── TodoList.js     # 할 일 목록 컴포넌트
│   └── TodoItem.js     # 개별 할 일 항목 컴포넌트
└── index.js            # 앱 진입점
```

## 구현된 API

### createElement

HTML 요소나 컴포넌트를 생성하는 함수입니다. React의 createElement와 유사합니다.

```javascript
createElement(type, props, ...children);
```

### useState

컴포넌트 내부에서 상태를 관리하기 위한 훅입니다.

```javascript
const [state, setState] = useState(initialValue);
```

### useEffect

컴포넌트의 렌더링 이후에 실행되는 부수 효과를 관리하기 위한 훅입니다.

```javascript
useEffect(callback, dependencies);
```

## 할 일 목록 예제

이 프로젝트는 가상 DOM 라이브러리를 활용한 할 일 목록(TodoList) 애플리케이션을 포함하고 있습니다:

- 할 일 추가
- 할 일 삭제
- 할 일 완료/미완료 토글

## 학습 포인트

이 프로젝트를 통해 다음과 같은 내용을 학습할 수 있습니다:

1. **가상 DOM의 작동 원리**: 실제 DOM을 효율적으로 업데이트하는 방법
2. **상태 관리 메커니즘**: React 스타일의 상태 관리 방식
3. **이벤트 처리**: 가상 DOM에서의 이벤트 바인딩 및 처리
4. **컴포넌트 라이프사이클**: useEffect를 통한 생명주기 관리
5. **렌더링 최적화**: 불필요한 리렌더링을 방지하는 방법

## 특이사항 및 알려진 문제점

- 가상 DOM과 실제 DOM 간의 재조정(reconciliation) 알고리즘은 간소화되어 있습니다.
- 이벤트 처리 시스템에서 추가 버튼의 경우 두 번 클릭해야 상태가 UI에 반영되는 특이한 현상이 있습니다. 이 부분에 대한 원인은 발견하지 못하였습니다.
