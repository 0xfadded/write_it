import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Path, Line, Circle } from 'react-native-svg';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  onStrokeEnd: (stroke: Point[]) => void;
  targetStrokes?: string[];
  currentStrokeIndex?: number;
  clearTrigger?: number; // prop to clear internal state
}

export default function DrawingCanvas({ onStrokeEnd, targetStrokes, currentStrokeIndex, clearTrigger }: DrawingCanvasProps) {
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [completedPaths, setCompletedPaths] = useState<Point[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  React.useEffect(() => {
    if (clearTrigger) {
      setCurrentPath([]);
      setCompletedPaths([]);
    }
  }, [clearTrigger]);

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

  // Helper to get starting point of SVG path
  const getStartingPoint = (d: string) => {
    const match = d.match(/M\s*([\d.]+)[,\s]+([\d.]+)/i);
    if (match) {
      return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
    }
    return null;
  };

  // Fallback for web mouse/touch events outside of gesture handler
  const handlePointerDown = (e: any) => {
    setIsDrawing(true);
    // The native layout is 300x300, viewbox is 100x100
    // e.nativeEvent.offsetX/Y are specific to web, e.nativeEvent.locationX/Y work on mobile
    const rawX = e.nativeEvent.offsetX ?? e.nativeEvent.locationX ?? 0;
    const rawY = e.nativeEvent.offsetY ?? e.nativeEvent.locationY ?? 0;
    const x = (rawX / 300) * 100;
    const y = (rawY / 300) * 100;
    setCurrentPath([{ x, y }]);
  };

  const handlePointerMove = (e: any) => {
    if (!isDrawing) return;
    const rawX = e.nativeEvent.offsetX ?? e.nativeEvent.locationX ?? 0;
    const rawY = e.nativeEvent.offsetY ?? e.nativeEvent.locationY ?? 0;
    const x = (rawX / 300) * 100;
    const y = (rawY / 300) * 100;
    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath.length > 0) {
      setCompletedPaths(prev => [...prev, currentPath]);
      onStrokeEnd(currentPath);
      setCurrentPath([]);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      minDist={0}
    >
      <View
        style={styles.canvasContainer}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Svg height="100%" width="100%" viewBox="0 0 100 100" style={{ touchAction: 'none' } as any}>
          {/* Background Grid */}
          <Line x1="0" y1="50" x2="100" y2="50" stroke="#444" strokeWidth="0.5" strokeDasharray="4 4" />
          <Line x1="50" y1="0" x2="50" y2="100" stroke="#444" strokeWidth="0.5" strokeDasharray="4 4" />
          <Line x1="0" y1="0" x2="100" y2="100" stroke="#444" strokeWidth="0.5" strokeDasharray="4 4" />
          <Line x1="0" y1="100" x2="100" y2="0" stroke="#444" strokeWidth="0.5" strokeDasharray="4 4" />

          {/* Target Strokes (Guided Mode) */}
          {targetStrokes && targetStrokes.map((stroke, index) => {
            const isCurrent = currentStrokeIndex === index;
            const startPoint = isCurrent ? getStartingPoint(stroke) : null;
            return (
              <React.Fragment key={`target-${index}`}>
                <Path
                  d={stroke}
                  stroke={isCurrent ? "#555" : "#333"} // Lighter for upcoming, slightly darker for current target
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={index < (currentStrokeIndex || 0) ? 0.8 : 0.4}
                />
                {isCurrent && startPoint && (
                  <Circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r="4"
                    fill="#ccc"
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* User's Completed Paths */}
          {completedPaths.map((path, index) => (
            <Path
              key={`user-completed-${index}`}
              d={createSvgPath(path)}
              stroke="#eee"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* User's Current Path (Drawing in progress) */}
          {currentPath.length > 0 && (
            <Path
              d={createSvgPath(currentPath)}
              stroke="#ccc"
              strokeWidth="6"
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
    width: 300,
    height: 300,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
  },
});