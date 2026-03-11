import React from "react";
import { View, TouchableOpacity, Switch } from "react-native";
import { Image } from "expo-image";
import { TextInput } from "@/components/textinput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSettings } from "@/context/settings-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function FilterSettings() {
    const { settings, updateSetting } = useSettings();

    const toggleFilter = (key: keyof typeof settings.filterOptions) => {
        updateSetting("filterOptions", {
            ...settings.filterOptions,
            [key]: !settings.filterOptions[key],
        });
    };

    return (
        <View className="mt-8">
            <ThemedText className="text-2xl font-bold">
                Filtrování spojů
            </ThemedText>
            <ThemedView className="flex-row gap-5 mt-3 mb-2">
                <ThemedText className="text-sm font-bold">
                    Zapnout filtrování:
                </ThemedText>
                <Switch
                    value={settings.filterOptions.filtersEnabled}
                    onValueChange={(value) =>
                        updateSetting("filterOptions", {
                            ...settings.filterOptions,
                            filtersEnabled: value,
                        })
                    }
                />
            </ThemedView>
            <ThemedText className="text-sm mb-4">
                Zde můžete nastavit, které typy spojů se mají zobrazovat případně nastavit preferované linky.
            </ThemedText>
            
            <TextInput
                className="w-full mb-4"
                value={settings.filterOptions.preferedLines.join(", ")}
                onChangeText={(t) => {
                    updateSetting("filterOptions", {
                        ...settings.filterOptions,
                        preferedLines: t.trim() === "" ? [] : t.split(",").map((s) => s.trim()).filter((s) => s !== ""),
                    });
                }}
                placeholder="Preferované linky (S1, 177, C, B, ...)"
            />
            
            <View className="flex-row flex-wrap gap-3">
                <FilterChip 
                    label="Linky S"
                    isActive={settings.filterOptions.SLineTrains} 
                    onPress={() => toggleFilter("SLineTrains")} 
                >
                   <Image source={require("@/assets/LinkySLogo.png")} className="w-4 h-4" />
                </FilterChip>
                <FilterChip 
                    label="Ostatní vlaky" 
                    isActive={settings.filterOptions.otherTrains} 
                    onPress={() => toggleFilter("otherTrains")} 
                />
                <FilterChip 
                    label="Autobusy" 
                    isActive={settings.filterOptions.buses} 
                    onPress={() => toggleFilter("buses")} 
                />
                <FilterChip 
                    label="Tramvaje" 
                    isActive={settings.filterOptions.trams} 
                    onPress={() => toggleFilter("trams")} 
                />
                <FilterChip 
                    label="Metro" 
                    isActive={settings.filterOptions.metro} 
                    onPress={() => toggleFilter("metro")} 
                />
                <FilterChip 
                    label="Noční linky" 
                    isActive={settings.filterOptions.nightLines} 
                    onPress={() => toggleFilter("nightLines")} 
                />
            </View>
        </View>
    );
}

function FilterChip({ label, isActive, onPress, children }: { label: string, isActive: boolean, onPress: () => void, children?: React.ReactNode }) {
    return (
        <TouchableOpacity
            className={`flex-row items-center gap-2 rounded-full px-3 py-1.5 ${isActive ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"}`}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <FontAwesome6
                name={isActive ? "check" : "xmark"}
                size={14}
                color="white"
            />
            <ThemedText className="text-white text-sm font-medium">{label}</ThemedText>
            {children}
        </TouchableOpacity>
    );
}
