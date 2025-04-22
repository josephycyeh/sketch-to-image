// src/types/drawing.ts
export type Point = { x: number; y: number };

export interface Path {
  points: Point[];
  color: string;
  width: number;
  mode: 'draw' | 'erase';
}

export type Tool = 'brush' | 'eraser';

export interface DrawingState {
  paths: Path[];
  undoStack: Path[][];
  redoStack: Path[][];
  currentTool: Tool;
  color: string;
  strokeWidth: number;
}

export type Action =
  | { type: 'ADD_PATH'; payload: Path }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' }
  | { type: 'SET_TOOL'; tool: Tool }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'SET_WIDTH'; width: number };
