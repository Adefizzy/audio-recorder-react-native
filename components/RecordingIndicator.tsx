import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export const PingAnimation = () => {
  const pingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animatePing = () => {
      pingAnim.setValue(0);
      Animated.timing(pingAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => animatePing());
    };

    animatePing();
  }, [pingAnim]);

  const pingStyle = {
    opacity: pingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.75, 0],
    }),
    transform: [
      {
        scale: pingAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.ping, pingStyle]} />
        <View style={styles.innerCircle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    position: 'relative',
    height: 12, // 3px * 4 for scaling up
    width: 12,  // 3px * 4 for scaling up
  },
  ping: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 50,
    backgroundColor: 'red', // equivalent to `bg-destructive`
  },
  innerCircle: {
    position: 'relative',
    height: 12, // 3px * 4 for scaling up
    width: 12,  // 3px * 4 for scaling up
    borderRadius: 50,
    backgroundColor: 'red', // equivalent to `bg-destructive`
  },
});



