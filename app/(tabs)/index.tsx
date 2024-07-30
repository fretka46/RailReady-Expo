import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { useSettings } from '@/context/SettingsContext';

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);

export default function TabOneScreen() {
  // Settings interface
  const { settings } = useSettings();

  // Main time countdown logic
  const [time, setTime] = useState(600);

  const animatedValue = useRef(new Animated.Value(time)).current;
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime > 0) {
          Animated.timing(animatedValue, {
            toValue: prevTime - 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
          return prevTime - 1;
        } else {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          return 0;
        }
      });
    }, 1000);
  
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [animatedValue, settings]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, settings.progressbarOffset],
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
          strokeDashoffset={time <= settings.progressbarOffset ? strokeDashoffset : circumference}
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