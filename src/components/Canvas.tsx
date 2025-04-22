// src/components/Canvas.tsx
import React, { useContext, useRef, useMemo, memo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import type { SkPath } from '@shopify/react-native-skia';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { DrawingContext, PathData, Tool } from '../context/DrawingContext';

const { width, height } = Dimensions.get('window');

interface Point {
  x: number;
  y: number;
}

const getMidPoint = (p1: Point, p2: Point): Point => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
});

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
  
  // Memoize paths rendering
  const renderedPaths = useMemo(() => 
    paths.map((p, i) => (
      <PathDrawing key={i} pathData={p} />
    ))
  , [paths]);

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
    },
    onPanResponderMove: (evt) => {
      const { locationX: x, locationY: y } = evt.nativeEvent;
      if (lastPointRef.current && pathRef.current) {
        const currentPoint = { x, y };
        const midPoint = getMidPoint(lastPointRef.current, currentPoint);

        // Create a smooth curve using quadratic bezier
        pathRef.current.quadTo(
          lastPointRef.current.x,
          lastPointRef.current.y,
          midPoint.x,
          midPoint.y
        );

        const pathData: PathData = {
          path: pathRef.current,
          color: currentTool === 'eraser' ? 'transparent' : currentColor,
          strokeWidth: currentStrokeWidth,
          tool: currentTool,
        };

        dispatch({ type: 'ADD_PATH', payload: pathData });
        lastPointRef.current = currentPoint;
      }
    },
    onPanResponderRelease: () => {
      // Add final line to current point for a complete stroke
      if (lastPointRef.current && pathRef.current) {
        pathRef.current.lineTo(lastPointRef.current.x, lastPointRef.current.y);
        
        const pathData: PathData = {
          path: pathRef.current,
          color: currentTool === 'eraser' ? 'transparent' : currentColor,
          strokeWidth: currentStrokeWidth,
          tool: currentTool,
        };
        
        dispatch({ type: 'ADD_PATH', payload: pathData });
      }
      lastPointRef.current = null;
      pathRef.current = null;
    },
    onPanResponderTerminate: () => {
      lastPointRef.current = null;
      pathRef.current = null;
    },
  }), [currentColor, currentStrokeWidth, currentTool]);

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
    backgroundColor: 'transparent',
  },
  canvas: {
    width,
    height,
    backgroundColor: '#fff',
  },
});

// Wrap the main component with memo
export default memo(DrawingCanvas);