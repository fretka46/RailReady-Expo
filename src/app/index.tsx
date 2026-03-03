import { useTheme } from "@/../hooks/use-theme";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TrainClock } from "@/components/train-clock";
import { useSettings } from "@/context/settings-context";
import { isUpdating, updateData } from "@/modules/data-updater";
import * as Train from "@/modules/train";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexScreen() {
    // Získání přístupu k nastavení
    const { settings, isLoading } = useSettings();
    const theme = useTheme();
    const [clockSeconds, setSeconds] = useState<number>(0);
    const [currentTrain, setCurrentTrain] = useState<Train.default | null>(
        Train.getTrain(),
    );

    const handleMoveIndex = (forward: boolean) => {
        Train.moveIndex(forward);
        const train = Train.getTrain();
        setSeconds(train ? train.departuresIn() : 0);
        setCurrentTrain(train);
    };

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

                    {/*Line*/}
                    <View className="w-96 h-px bg-gray-300 dark:bg-gray-700 mt-4 mb-12" />

                    <ThemedText className="text-7xl font-bold">
                        {currentTrain?.line || "N/A"}
                    </ThemedText>
                    <ThemedText className="text-xl">
                        {currentTrain
                            ? currentTrain.scheduledTime.toLocaleTimeString(
                                  [],
                                  {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  },
                              )
                            : "N/A"}
                    </ThemedText>
                    <View className="mb-4 flex-row items-center w-full">
                        <View className="flex-1 items-end pr-2">
                            <FontAwesome6
                                name="arrow-right-long"
                                size={20}
                                color={theme.text}
                            />
                        </View>
                        <ThemedText
                            className={`text-lg px-1 rounded-md ${currentTrain?.headsign == "Praha hl.n." ? "bg-red-500" : ""}`}
                        >
                            {currentTrain?.headsign || "Žádný spoj nenalezen"}
                        </ThemedText>
                        <View className="flex-1" />
                    </View>

                    <View className="flex-row w-full items-center justify-center">
                        <TouchableOpacity
                            className="w-10 h-16 mr-8 rounded-md items-center justify-center"
                            activeOpacity={0.2}
                            onPress={() => handleMoveIndex(false)}
                        >
                            <FontAwesome6
                                name="chevron-left"
                                size={24}
                                color={theme.text}
                            />
                        </TouchableOpacity>

                        <TrainClock secondsRemaining={clockSeconds} />

                        <TouchableOpacity
                            className="w-10 h-16 ml-8 rounded-md items-center justify-center"
                            activeOpacity={0.2}
                            onPress={() => handleMoveIndex(true)}
                        >
                            <FontAwesome6
                                name="chevron-right"
                                size={24}
                                color={theme.text}
                            />
                        </TouchableOpacity>
                    </View>
                </ThemedView>

                <ThemedText className="text-2xl flex-row text-center">
                    Delay:{" "}
                    <ThemedText
                        className={
                            currentTrain?.formattedDelay().startsWith("+")
                                ? "text-red-500 font-bold text-2xl"
                                : "text-green-500 font-bold text-2xl"
                        }
                    >
                        {currentTrain?.formattedDelay()}
                    </ThemedText>
                </ThemedText>

                <ThemedText className="text-sm mt-2 text-center">
                    Last stop: {currentTrain?.last_stop || "N/A"}
                </ThemedText>

                {!currentTrain?.isDelayValid && (
                    <ThemedText className="text-sm mt-4 text-center text-red-400">
                        Zpoždění není aktuální! {"\n"} Odjel vlak z výchozí
                        stanice?
                    </ThemedText>
                )}
            </SafeAreaView>
        </ThemedView>
    );
}
