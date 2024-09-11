import React, { useMemo } from 'react';
import {View, Animated, PanResponderInstance} from 'react-native';
import {Center} from './ui/center';
import {Box} from './ui/box';
import {Icon} from './ui/icon';
import {Mic} from 'lucide-react-native';

type Props = {
  pan: Animated.ValueXY;
  scale: Animated.Value;
  opacity: Animated.Value;
  size: Animated.Value;
  panResponder: PanResponderInstance;
  isVisible: boolean;
  isTouching: boolean;
};

export const DraggableCircle = ({
  pan,
  scale,
  size,
  panResponder,
  isVisible,
}: Props) => {
  const animatedStyle = useMemo(() => ({
    transform: [
      ...pan.getTranslateTransform(),
      {scale},
      {
        translateX: size.interpolate({
          inputRange: [50, 100],
          outputRange: [0, 20], // -30Adjust based on size to keep centered
        }),
      },
      {
        translateY: size.interpolate({
          inputRange: [50, 100],
          outputRange: [0, 20], // -30 Adjust based on size to keep centered
        }),
      },
    ],
    //opacity: opacity,
    width: size,
    height: size,
  }), [pan, scale, size]);

  return (
    <View
      className="flex-1 justify-center items-center">
      {isVisible && (
        <Animated.View
          className="bg-secondary-0 rounded-full"
          {...panResponder.panHandlers}
          style={[
            /*  pan.getLayout(),
            {
              transform: [{ scale }],
              opacity: opacity,
              width: size,
              height: size,
            }, */
            pan.getLayout(),
            animatedStyle,
           // styles.circle,
          ]}>
          {isVisible && (
            <Box>
              <Center
                className="w-full h-full rounded-full" /* className={isTouching? "w-24 h-24" : "w-12 h-12"} */
              >
                <Icon as={Mic} size="md" color="white" />
              </Center>
            </Box>
          )}
        </Animated.View>
      )}
    </View>
  );
};

/* const styles = StyleSheet.create({
  container: {
     flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    // backgroundColor: "red",
    // borderRadius: 50, // Still applies, but size changes dynamically
  },
  statusContainer: {
    marginTop: 20,
  },
}); */
