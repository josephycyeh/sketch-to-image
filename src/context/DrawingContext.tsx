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
  undoStack: PathData[];
  redoStack: PathData[];
  currentColor: string;
  currentStrokeWidth: number;
  currentTool: Tool;
}

type Action =
  | { type: 'ADD_PATH'; payload: PathData }
  | { type: 'UPDATE_PATH'; payload: { index: number; path: PathData } }
  | { type: 'FINALIZE_PATH'; payload: { index: number; path: PathData } }
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

// Helper function to clone a path
const clonePath = (pathData: PathData): PathData => ({
  ...pathData,
  path: pathData.path.copy() // Use Skia's copy method for the path
});

// Helper function to clone an array of paths
const clonePaths = (paths: PathData[]): PathData[] => 
  paths.map(clonePath);

function reducer(state: DrawingState, action: Action): DrawingState {
  switch (action.type) {
    case 'ADD_PATH':
      return {
        ...state,
        paths: [...state.paths, clonePath(action.payload)],
        redoStack: [], // Clear redo stack on new path
      };

    case 'UPDATE_PATH': {
      const newPaths = [...state.paths];
      newPaths[action.payload.index] = clonePath(action.payload.path);
      return {
        ...state,
        paths: newPaths,
      };
    }

    case 'FINALIZE_PATH': {
      const newPaths = [...state.paths];
      newPaths[action.payload.index] = clonePath(action.payload.path);
      return {
        ...state,
        paths: newPaths,
        undoStack: [...state.undoStack, clonePath(action.payload.path)],
        redoStack: [], // Clear redo stack when finalizing a path
      };
    }

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      
      const lastPath = state.undoStack[state.undoStack.length - 1];
      const newPaths = state.paths.slice(0, -1); // Remove last path
      
      return {
        ...state,
        paths: newPaths,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [clonePath(lastPath), ...state.redoStack],
      };
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state;
      
      const pathToRedo = state.redoStack[0];
      return {
        ...state,
        paths: [...state.paths, clonePath(pathToRedo)],
        redoStack: state.redoStack.slice(1),
        undoStack: [...state.undoStack, clonePath(pathToRedo)],
      };
    }

    case 'CLEAR':
      return {
        ...state,
        paths: [],
        undoStack: [],
        redoStack: [], // Clear all stacks on clear
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
