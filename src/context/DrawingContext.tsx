// src/context/DrawingContext.tsx
import React, { createContext, useReducer, PropsWithChildren } from 'react';
import type { SkPath } from '@shopify/react-native-skia';

export type Tool = 'brush' | 'eraser';

export interface PathData {
  path: SkPath;
  color: string;
  strokeWidth: number;
  tool: Tool;
}

export interface DrawingState {
  paths: PathData[];
  undoStack: PathData[][];
  redoStack: PathData[][];
  currentColor: string;
  currentStrokeWidth: number;
  currentTool: Tool;
}

type Action =
  | { type: 'ADD_PATH'; payload: PathData }
  | { type: 'UPDATE_PATH'; payload: { index: number; path: PathData } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'SET_STROKE_WIDTH'; width: number }
  | { type: 'SET_TOOL'; tool: Tool };

const initialState: DrawingState = {
  paths: [],
  undoStack: [],
  redoStack: [],
  currentColor: '#000000',
  currentStrokeWidth: 5,
  currentTool: 'brush',
};

function reducer(state: DrawingState, action: Action): DrawingState {
  switch (action.type) {
    case 'ADD_PATH':
      return {
        ...state,
        paths: [...state.paths, action.payload],
        undoStack: [...state.undoStack, state.paths],
        redoStack: [],
      };
    case 'UPDATE_PATH': {
      const newPaths = [...state.paths];
      newPaths[action.payload.index] = action.payload.path;
      return {
        ...state,
        paths: newPaths,
      };
    }
    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        paths: prev,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.paths],
      };
    }
    case 'REDO': {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        paths: next,
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, state.paths],
      };
    }
    case 'CLEAR':
      return {
        ...state,
        paths: [],
        undoStack: [...state.undoStack, state.paths],
        redoStack: [],
      };
    case 'SET_COLOR':
      return { ...state, currentColor: action.color };
    case 'SET_STROKE_WIDTH':
      return { ...state, currentStrokeWidth: action.width };
    case 'SET_TOOL':
      return { ...state, currentTool: action.tool };
    default:
      return state;
  }
}

export const DrawingContext = createContext<{
  state: DrawingState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const DrawingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DrawingContext.Provider value={{ state, dispatch }}>
      {children}
    </DrawingContext.Provider>
  );
};
