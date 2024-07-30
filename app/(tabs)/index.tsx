import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { useSettings } from '@/context/SettingsContext';
import TrainClock from '@/components/TrainClock';

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);

export default function TabOneScreen() {
  // Settings interface
  const { settings } = useSettings();

  // Main time countdown logic
  const [time, setTime] = useState(60);

  return (
    <View style={styles.container}>
      <TrainClock 
        settings={settings}
        timeRemaining={time}
      />
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