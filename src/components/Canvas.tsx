// src/components/Canvas.tsx
import React, { useContext, useRef, useMemo, memo } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
} from 'react-native';
import type { SkPath } from '@shopify/react-native-skia';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { DrawingContext, PathData, Tool } from '../context/DrawingContext';

interface Point {
  x: number;
  y: number;
}

// Memoized component for individual path rendering
const PathDrawing = memo(({ pathData }: { pathData: PathData }) => (
  <Path
    path={pathData.path}
    style="stroke"
    strokeJoin="round"
    strokeCap="round"
    color={pathData.tool === 'eraser' ? 'transparent' : pathData.color}
    strokeWidth={pathData.strokeWidth}
    blendMode={pathData.tool === 'eraser' ? 'clear' : 'srcOver'}
  />
));

const DrawingCanvas: React.FC = () => {
  const { state, dispatch } = useContext(DrawingContext);
  const {
    currentColor,
    currentStrokeWidth,
    currentTool,
    paths,
  } = state;

  const lastPointRef = useRef<Point | null>(null);
  const pathRef = useRef<SkPath | null>(null);
  const pathIndexRef = useRef<number>(-1);
  
  // Memoize paths rendering
  const renderedPaths = useMemo(() => 
    paths.map((p, i) => (
      <PathDrawing key={i} pathData={p} />
    ))
  , [paths]);

  const getMidPoint = (p1: Point, p2: Point): Point => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  // Create PanResponder with useMemo for better performance
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX: x, locationY: y } = evt.nativeEvent;
      const newPath = Skia.Path.Make();
      newPath.moveTo(x, y);
      
      pathRef.current = newPath;
      lastPointRef.current = { x, y };

      const pathData: PathData = {
        path: newPath,
        color: currentTool === 'eraser' ? 'transparent' : currentColor,
        strokeWidth: currentStrokeWidth,
        tool: currentTool,
      };

      dispatch({ type: 'ADD_PATH', payload: pathData });
      pathIndexRef.current = paths.length;
    },
    onPanResponderMove: (evt) => {
      const { locationX: x, locationY: y } = evt.nativeEvent;
      if (lastPointRef.current && pathRef.current && pathIndexRef.current !== -1) {
        const currentPoint = { x, y };
        const midPoint = getMidPoint(lastPointRef.current, currentPoint);

        // Create a smooth curve using quadratic bezier
        const path = pathRef.current;
        path.quadTo(
          lastPointRef.current.x,
          lastPointRef.current.y,
          midPoint.x,
          midPoint.y
        );

        const pathData: PathData = {
          path: path.copy(), // Create a copy to prevent mutations
          color: currentTool === 'eraser' ? 'transparent' : currentColor,
          strokeWidth: currentStrokeWidth,
          tool: currentTool,
        };

        // Update the current path instead of adding a new one
        dispatch({ 
          type: 'UPDATE_PATH', 
          payload: { 
            index: pathIndexRef.current,
            path: pathData 
          }
        });
        
        lastPointRef.current = currentPoint;
      }
    },
    onPanResponderRelease: () => {
      if (lastPointRef.current && pathRef.current && pathIndexRef.current !== -1) {
        const path = pathRef.current;
        path.lineTo(lastPointRef.current.x, lastPointRef.current.y);
        
        const pathData: PathData = {
          path: path.copy(), // Create a copy to prevent mutations
          color: currentTool === 'eraser' ? 'transparent' : currentColor,
          strokeWidth: currentStrokeWidth,
          tool: currentTool,
        };
        
        // Finalize the path and add it to undo stack
        dispatch({ 
          type: 'FINALIZE_PATH', 
          payload: { 
            index: pathIndexRef.current,
            path: pathData 
          }
        });
      }
      lastPointRef.current = null;
      pathRef.current = null;
      pathIndexRef.current = -1;
    },
    onPanResponderTerminate: () => {
      lastPointRef.current = null;
      pathRef.current = null;
      pathIndexRef.current = -1;
    },
  }), [currentColor, currentStrokeWidth, currentTool, paths.length]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Canvas style={styles.canvas}>
        {renderedPaths}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
});

export default memo(DrawingCanvas);