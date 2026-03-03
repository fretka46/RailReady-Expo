import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TrainClock } from "@/components/train-clock";
import { useSettings } from "@/context/settings-context";
import { isUpdating, updateData } from "@/modules/data-updater";
import * as Train from "@/modules/train";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexScreen() {
    // Získání přístupu k nastavení
    const { settings, isLoading } = useSettings();
    const [clockSeconds, setSeconds] = useState<number>(0);
    const [currentTrain, setCurrentTrain] = useState<Train.default | null>(
        Train.getTrain(),
    );

    useEffect(() => {
        if (isLoading) return;

        updateData(settings);
        const train = Train.getTrain();
        setSeconds(train ? train.departuresIn() : 0);
        setCurrentTrain(train);

        const trainInterval = setInterval(() => {
            updateData(settings);
            const train = Train.getTrain();
            setSeconds(train ? train.departuresIn() : 0);
            setCurrentTrain(train);

            // Refresh interval
        }, 21000);

        return () => clearInterval(trainInterval);
    }, [isLoading, settings]);

    // Ticking clock
    useEffect(() => {
        if (isLoading) return;

        const interval = setInterval(() => {
            setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [isLoading]);

    if (isLoading) return null;

    return (
        <ThemedView
            className={`flex-1 ${Platform.OS === "web" ? "pt-20" : ""}`}
        >
            <SafeAreaView className="flex-1">
                {/* Refresh indicator */}
                {isUpdating && (
                    <View className="absolute top-4 right-6 z-10">
                        <ActivityIndicator size="large" color="#888" />
                        <ThemedText className="text-sm mt-1">
                            Updating
                        </ThemedText>
                    </View>
                )}

                <ThemedView className="mb-12 items-center">
                    <ThemedText className="text-2xl font-bold">
                        {settings.station}
                    </ThemedText>

                    <ThemedText className="text-7xl font-bold">
                        {currentTrain?.line || "N/A"}
                    </ThemedText>
                    <ThemedText className="text-lg mb-4">
                        {currentTrain?.headsign || "Žádný vlak"}
                    </ThemedText>

                    <TrainClock secondsRemaining={clockSeconds} />
                </ThemedView>

                <ThemedView className="mt-12 w-full p-6 rounded-2xl items-center">
                    <ThemedText className="text-sm text-center">
                        Tento testovací časovač začal odpočítávat z:{" "}
                        {settings.timerStartSeconds} s
                    </ThemedText>
                </ThemedView>
            </SafeAreaView>
        </ThemedView>
    );
}
