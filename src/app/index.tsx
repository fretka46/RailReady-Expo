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
    const { settings, isLoading, updateSetting } = useSettings();
    const theme = useTheme();
    const [clockSeconds, setSeconds] = useState<number>(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [currentTrain, setCurrentTrain] = useState<Train.default | null>(
        Train.getTrain(),
    );
    const [trainIndex, setTrainIndex] = useState<number>(0);
    const [isBack, setIsBack] = useState<boolean>(Train.isBack);

    const handleSwitchDirection = () => {
        Train.toggleIsBack();
        setIsBack(Train.isBack);
        setTrainIndex(0);
        const train = Train.getTrain();
        setSeconds(train ? train.departuresIn() : 0);
        setCurrentTrain(train);
    };

    const handleMoveIndex = (forward: boolean) => {
        const currentIndex = Train.currentTrainIndex;
        const currentLength = Train.isBack
            ? Train.trainsBack.length
            : Train.trains.length;
        const isLastIndex = currentIndex >= currentLength - 1;
        const isFirstIndex = currentIndex <= 0;

        console.debug("Attempting to move index", {
            forward,
            isLastIndex,
            isFirstIndex,
            currentIndex,
            currentLength,
            isBack: Train.isBack,
        });

        if ((forward && isLastIndex) || (!forward && isFirstIndex)) return;

        Train.moveIndex(forward);
        setTrainIndex(Train.currentTrainIndex);
        const train = Train.getTrain();
        setSeconds(train ? train.departuresIn() : 0);
        setCurrentTrain(train);
    };

    useEffect(() => {
        if (isLoading) return;

        const loadData = async () => {
            await updateData(settings);
            const train = Train.getTrain();
            setTrainIndex(Train.currentTrainIndex);
            setSeconds(train ? train.departuresIn() : 0);
            setCurrentTrain(train);
        };

        loadData();

        const trainInterval = setInterval(() => {
            loadData();
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
            <SafeAreaView edges={["left", "right", "top", "bottom"]} className="flex-1">
                {/* Refresh indicator */}
                {isUpdating && (
                    <View className="absolute top-40 right-6 z-10">
                        <ActivityIndicator size="large" color="#888" />
                        <ThemedText className="text-sm mt-1">
                            Updating
                        </ThemedText>
                    </View>
                )}

                <ThemedView className="mb-12 items-center w-full z-50">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex-row items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-lg"
                    >
                        <ThemedText className="text-2xl font-bold text-center">
                            {settings.station}
                        </ThemedText>
                        <FontAwesome6
                            name={
                                isDropdownOpen ? "chevron-up" : "chevron-down"
                            }
                            size={16}
                            color={theme.text}
                        />
                    </TouchableOpacity>

                    {isDropdownOpen && (
                        <View
                            className="absolute top-14 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                            style={{ zIndex: 100, elevation: 5 }}
                        >
                            {settings.stationPresets.map((preset) => (
                                <TouchableOpacity
                                    key={preset}
                                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${preset === settings.station ? "bg-blue-100 dark:bg-blue-900" : ""}`}
                                    onPress={() => {
                                        updateSetting("station", preset);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <ThemedText className="text-center text-lg">
                                        {preset}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <ThemedText className="text-sm font-medium mt-2">
                        {trainIndex + 1} /{" "}
                        {isBack ? Train.trainsBack.length : Train.trains.length}
                    </ThemedText>

                    {/*Line*/}
                    <View className="w-96 h-px bg-gray-300 dark:bg-gray-700 mt-4 mb-4" />

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

                <ThemedText
                    className={`text-sm mt-4 text-center text-red-400 ${currentTrain && !currentTrain?.isDelayValid ? "opacity-100" : "opacity-0"}`}
                >
                    Zpoždění není aktuální! {"\n"} Odjel vlak z výchozí stanice?
                </ThemedText>

                <TouchableOpacity
                    className={`mt-8 px-10 py-5 rounded-md self-center ${isBack ? "bg-green-500" : "bg-blue-500"}`}
                    onPress={handleSwitchDirection}
                >
                    <ThemedText>
                        <FontAwesome6 name="arrow-right-arrow-left" size={24} />
                    </ThemedText>
                </TouchableOpacity>
            </SafeAreaView>
        </ThemedView>
    );
}
