import {useCallback, useMemo, useRef, useState} from 'react';
import {Animated, PanResponder} from 'react-native';

const INITIAL_SIZE = 50;

type Props = {
  startRecording(): Promise<void>;
  stopRecording(): Promise<void>;
};
export function useDraggableCircle({startRecording, stopRecording}: Props) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const size = useRef(new Animated.Value(INITIAL_SIZE)).current;

  // States to track touch and drag events
  const [isDragging, setIsDragging] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const threshold = -30; // Minimum height (100px) the circle should reach to avoid resetting

  const resetCircle = useCallback(() => {
    setIsVisible(true);
    setIsDragging(false);

    Animated.parallel([
      Animated.spring(pan, {toValue: {x: 0, y: 0}, useNativeDriver: false}),
      Animated.spring(scale, {toValue: 1, useNativeDriver: false}),
      // Animated.spring(opacity, { toValue: 1, useNativeDriver: false }),
      Animated.spring(size, {toValue: INITIAL_SIZE, useNativeDriver: false}),
    ]).start();
  }, [pan, scale, size]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: async () => {
          setIsTouching(true);
          // START RECORDING
          await startRecording();
          Animated.timing(size, {
            toValue: 100, // Expand the circle on touch
            duration: 150,
            useNativeDriver: false,
          }).start();
        },
        onPanResponderMove: (e, gestureState) => {
          const {dy} = gestureState;
          if (dy < 0) {
            setIsDragging(true);
            pan.setValue({x: 0, y: dy});

            const newScale = Math.max(1 + dy / 200, 0);
            scale.setValue(newScale);

            /*  const newOpacity = Math.max(1 + dy / 100, 0);
          opacity.setValue(newOpacity); */

            if (newScale <= 0.5 /* || newOpacity <= 0.1 */) {
              setIsVisible(false);
            }
          }
        },
        onPanResponderRelease: async (e, gestureState) => {
          setIsTouching(false);
          if (gestureState.dy > threshold) {
            // If the circle didn't reach the threshold, reset to initial state
            // reset circle and stop recording
            resetCircle();
            await stopRecording();
          } else if (isDragging) {

            // Keep the current behavior if dragging occurred
            setIsDragging(false);
          } else {

            // STOP RECORDING
            // Reset size if no drag occurred
            Animated.timing(size, {
              toValue: INITIAL_SIZE,
              duration: 150,
              useNativeDriver: false,
            }).start();
            await stopRecording();
          }
        },
      }),
    [
      isDragging,
      pan,
      resetCircle,
      scale,
      size,
      startRecording,
      stopRecording,
      threshold,
    ],
  );

  return {
    resetCircle,
    isTouching,
    isVisible,
    isDragging,
    pan,
    scale,
    size,
    panResponder,
    opacity,
  };
}
