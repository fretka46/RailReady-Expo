import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);

export default function TabOneScreen() {
  // Main time countdown logic
  const [time, setTime] = useState(700);

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

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 600],
    outputRange: [0, circumference]
  });

  return (
    <View style={styles.container}>
      <Svg height="400" width="400" viewBox="0 0 200 200" style={styles.progressBar}>
        <AnimatedCircle
          cx="100"
          cy="100"
          r={radius}
          stroke="red"
          strokeWidth="15"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}

          // Time before the progress bar starts filling
          strokeDashoffset={time <= 600 ? strokeDashoffset : circumference}
          // Rotate the circle to start from the top
          transform={`rotate(-90 100 100)`}
        />
      </Svg>
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
  progressBar: {
    position: 'absolute',
    zIndex: -1,
  },
});