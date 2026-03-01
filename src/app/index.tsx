import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSettings } from "@/context/settings-context";
import React from "react";

export default function IndexScreen() {
    // Takhle jednoduše získáš v jakékoliv části aplikace přístup k nastavení
    const { settings, isLoading } = useSettings();

    if (isLoading) return null;

    return (
        <ThemedView className="flex-1 items-center justify-center ">
            <ThemedText className="text-4xl bg-red-500 mb-4">AHOJ</ThemedText>
            <ThemedText className="text-lg">
                Sledovaná stanice z configu:
            </ThemedText>
            <ThemedText className="text-xl font-bold text-blue-500 mt-2">
                {settings.station}
            </ThemedText>
            <ThemedText className="text-md mt-4">
                Časovač začíná v: {settings.timerStartSeconds} s
            </ThemedText>
        </ThemedView>
    );
}
