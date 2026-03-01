import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TrainClock } from "@/components/train-clock";
import { useSettings } from "@/context/settings-context";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexScreen() {
    // Získání přístupu k nastavení
    const { settings, isLoading } = useSettings();
    const [clockSeconds, setSeconds] = useState<number>(0);


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
        <ThemedView className="flex-1 ">
          <SafeAreaView>
              <ThemedView className="mb-12 items-center">
                <ThemedText className="text-2xl font-bold">
                  {settings.station}
                </ThemedText>

                <ThemedText className="text-7xl font-bold">
                  S1
                </ThemedText>
                <ThemedText className="text-lg mb-4">
                  Praha masarykovo nádraží
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
