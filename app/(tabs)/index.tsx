import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

export default function TabOneScreen() {
  const [time, setTime] = useState(600); // 10 minutes in seconds
  const animatedValue = useRef(new Animated.Value(time)).current;
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime > 0) {
          animatedValue.setValue(prevTime - 1);
          return prevTime - 1;
        } else {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [animatedValue]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const animatedCircleStyle = {
    backgroundColor: 'red',
    width: animatedValue.interpolate({
      inputRange: [0, 600],
      outputRange: [200, 0]
    }),
    height: animatedValue.interpolate({
      inputRange: [0, 600],
      outputRange: [200, 0]
    }),
    borderRadius: animatedValue.interpolate({
      inputRange: [0, 600],
      outputRange: [100, 0]
    })
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedCircleStyle]} />
      <Text style={styles.title}>Train arrival in</Text>
      <Text style={styles.timeCounter}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 80,
  },
  timeCounter: {
    fontSize: 100,
    fontWeight: 'bold',
    position: 'absolute',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  circle: {
    position: 'absolute',
    zIndex: -1,
  },
});