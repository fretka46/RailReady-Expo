import React from "react";
import { View, useColorScheme } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSettings } from "../context/settings-context";
import { ThemedText } from "./themed-text";

interface TrainClockProps {
    secondsRemaining: number;
}

const SIZE = 250;
const STROKE_WIDTH = 15;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const TrainClock: React.FC<TrainClockProps> = ({ secondsRemaining }) => {
    const colorScheme = useColorScheme();
    const { settings } = useSettings();

    const maxSeconds = Number(settings.timerStartSeconds) || 600;
    const currentSeconds = Math.max(0, secondsRemaining);
    const isTimeUp = currentSeconds === 0;

    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const progress = Math.min(currentSeconds / maxSeconds, 1);
    const strokeDashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

    const trackColor = colorScheme === "dark" ? "#333333" : "#e5e5ea";

    const getIndicatorColor = () => {
        if (isTimeUp || currentSeconds <= 60) return "#ef4444"; // red
        if (currentSeconds <= 180) return "#f59e0b"; // orange
        return "#3b82f6"; // blue
    };

    return (
        <View
            style={{
                width: SIZE,
                height: SIZE,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Svg width={SIZE} height={SIZE} style={{ position: "absolute" }}>
                <Circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    stroke={trackColor}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />

                <Circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    stroke={getIndicatorColor()}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                />
            </Svg>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <ThemedText
                    className={`text-6xl font-bold tracking-tighter ${isTimeUp ? "text-red-500" : ""}`}
                    style={{ fontVariant: ["tabular-nums"] }}
                >
                    {timeString}
                </ThemedText>
                <ThemedText className="text-sm mt-1">do odjezdu</ThemedText>
            </View>
        </View>
    );
};
