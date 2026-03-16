import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  onStrokeEnd: (stroke: Point[]) => void;
}

export default function DrawingCanvas({ onStrokeEnd }: DrawingCanvasProps) {
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [completedPaths, setCompletedPaths] = useState<Point[][]>([]);

  const onGestureEvent = (event: any) => {
    const { x, y } = event.nativeEvent;
    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setCurrentPath([{ x: event.nativeEvent.x, y: event.nativeEvent.y }]);
    } else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      if (currentPath.length > 0) {
        setCompletedPaths(prev => [...prev, currentPath]);
        onStrokeEnd(currentPath);
        setCurrentPath([]);
      }
    }
  };

  const createSvgPath = (points: Point[]) => {
    if (points.length === 0) return '';
    const d = points.reduce((acc, point, index) => {
      return `${acc} ${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }, '');
    return d;
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      minDist={0}
    >
      <View style={styles.canvasContainer}>
        <Svg height="100%" width="100%">
          {completedPaths.map((path, index) => (
            <Path
              key={index}
              d={createSvgPath(path)}
              stroke="#000"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath.length > 0 && (
            <Path
              d={createSvgPath(currentPath)}
              stroke="#007AFF"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    width: 250,
    height: 250,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 15,
  },
});