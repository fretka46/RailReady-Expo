import { ExternalLink } from "@/components/external-link";
import { FilterSettings } from "@/components/filter-settings";
import { TextInput } from "@/components/textinput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSettings } from "@/context/settings-context";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Platform, ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ExploreScreen() {
    const { settings, updateSetting, isLoading } = useSettings();
    const [serverStatus, setServerStatus] = useState("unknown");

    // Check server status on load
    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                console.debug("Checking API server status...");

                const response = await fetch(
                    "https://api.railready.fretka.me/status",
                );
                const data = await response.json();

                // Update server status
                console.log("API server status:", data.golemio);

                switch (data.golemio) {
                    case "online":
                        setServerStatus("Online ✅");
                        break;
                    case "degraded":
                        setServerStatus("Prague API down! ⚠️");
                        break;
                    case "offline":
                        setServerStatus("Offline ❌");
                        break;
                    default:
                        setServerStatus("Unknown 🤔");
                }
            } catch (error) {
                console.error("Failed to check server status", error);
                setServerStatus("Offline ❌");
            }
        };
        checkServerStatus();
    }, []);

    // Pokud se data načítají, můžeme zatím ukázat prázdnou obrazovku
    if (isLoading) return null;

    return (
        <SafeAreaView
            edges={["left", "right", "top"]}
            className="flex-1 bg-white dark:bg-black"
        >
            <ScrollView>
                <ThemedView
                    className={`flex-1 items-center justify-center ${Platform.OS === "web" ? "pt-20" : ""}`}
                >
                    <ThemedText className="text-4xl font-bold mb-4">
                        RailReady
                    </ThemedText>
                    <ThemedText className="text-lg text-center px-4">
                        by Jonáš Vondra - v1.0.0
                    </ThemedText>

                    {/*Line*/}
                    <View className="w-96 h-px bg-gray-300 dark:bg-gray-700 mt-4 mb-12" />

                    <ThemedView className="w-full px-8">

                        {/*
                    No in function now

                    <ThemedText className="text-2xl font-bold mt-8">
                        Notifikace
                    </ThemedText>
                    <ThemedText className="text-sm mb-2">
                        V jaký časy mají chodit notifikace před odjezdem.
                        nastavení -1 notifikaci vypne
                    </ThemedText>
                    <ThemedView className="flex-row gap-6">
                        <ThemedView>
                            <ThemedText className="text-sm mb-1">
                                {" "}
                                1. Notifikace{" "}
                            </ThemedText>
                            <TextInput
                                className="w-24 text-center"
                                value={settings.notification1}
                                onChangeText={(t) =>
                                    updateSetting("notification1", t)
                                }
                                placeholder="sekundy"
                                keyboardType="numeric"
                            />
                        </ThemedView>
                        <ThemedView>
                            <ThemedText className="text-sm mb-1">
                                {" "}
                                2. Notifikace{" "}
                            </ThemedText>
                            <TextInput
                                className="w-24 text-center"
                                value={settings.notification2}
                                onChangeText={(t) =>
                                    updateSetting("notification2", t)
                                }
                                placeholder="sekundy"
                                keyboardType="numeric"
                            />
                        </ThemedView>
                        <ThemedView>
                            <ThemedText className="text-sm mb-1">
                                {" "}
                                3. Notifikace{" "}
                            </ThemedText>
                            <TextInput
                                className="w-24 text-center"
                                value={settings.notification3}
                                onChangeText={(t) =>
                                    updateSetting("notification3", t)
                                }
                                placeholder="sekundy"
                                keyboardType="numeric"
                            />
                        </ThemedView>
                    </ThemedView>

                    */}

                        <ThemedText className="text-2xl font-bold">
                            Sledovaná stanice
                        </ThemedText>
                        <ThemedText className="text-sm mb-2">
                            Přesný název stanice, kterou chcete sledovat. {"\n"}{" "}
                            Seznam stanic najdete na{" "}
                            <ExternalLink
                                className="text-blue-500 underline"
                                href="https://railready.fretka.me/stops.txt"
                            >
                                https://railready.fretka.me/stops.txt
                            </ExternalLink>
                            {"\n"}(použijte vyhledávání v prohlížeči)
                        </ThemedText>
                        <View className="flex-row items-center gap-3">
                            <TextInput
                                className="max-w-72 flex-1"
                                value={settings.station}
                                onChangeText={(t) =>
                                    updateSetting("station", t)
                                }
                                placeholder="Přesný název stanice"
                            />

                            <TouchableOpacity
                                className={`${!settings.stationPresets.includes(settings.station) ? "bg-green-500" : "bg-gray-400"} 
                                    rounded-lg flex-col items-center justify-center px-3 py-1`}
                                onPress={() =>
                                    // Save current station to presets if it's not already there
                                    updateSetting(
                                        "stationPresets",
                                        Array.from(
                                            new Set([
                                                ...settings.stationPresets,
                                                settings.station,
                                            ]),
                                        ),
                                    )
                                }
                                activeOpacity={0.7}
                            >
                                <MaterialIcons
                                    name="save-alt"
                                    size={24}
                                    color="white"
                                />
                                <ThemedText className="text-xs text-center text-white">
                                    Uložit
                                </ThemedText>
                            </TouchableOpacity>
                        </View>

                        <ThemedText className="mt-4 text-md font-bold">
                            Uložené stanice
                        </ThemedText>
                        <ThemedText className="text-sm mb-2">
                            Toto je seznam stanic, které máte uloženy pro rychlý
                            výběr. V hlavním menu můžete na některou z nich
                            rychle přepnout kliknutím na název stanice.
                        </ThemedText>
                        <ThemedView className="flex-col gap-3 self-start">
                            {settings.stationPresets.map((preset) => (
                                <View
                                    key={preset}
                                    className="flex-row items-center gap-3 w-full"
                                >
                                    <View className="bg-[#e5e5ea] dark:bg-[#1c1c1e] px-4 py-2 rounded-xl flex-1">
                                        <ThemedText
                                            className="text-sm text-center"
                                            onPress={() =>
                                                updateSetting("station", preset)
                                            }
                                        >
                                            {preset}
                                        </ThemedText>
                                    </View>

                                    <FontAwesome6
                                        name="trash-can"
                                        size={20}
                                        className="bg-red-500 rounded-full p-2"
                                        onPress={() => {
                                            const newPresets =
                                                settings.stationPresets.filter(
                                                    (s) => s !== preset,
                                                );
                                            updateSetting(
                                                "stationPresets",
                                                newPresets,
                                            );
                                        }}
                                    />
                                </View>
                            ))}
                        </ThemedView>

                        {/* -- Filter settings -- */}
                        <FilterSettings />

                        <ThemedText className="text-2xl font-bold mt-8">
                            Začátek odpočtu časovače
                        </ThemedText>
                        <ThemedText className="text-sm mb-2">
                            Čas v sekundách kdy začne grafický časovač
                            odpočítavat do odjezdu vlaku. (např. 600 = 10 minut
                            před odjezdem)
                        </ThemedText>
                        <TextInput
                            className="max-w-72 text-center"
                            value={settings.timerStartSeconds}
                            onChangeText={(t) =>
                                updateSetting("timerStartSeconds", t)
                            }
                            placeholder="Time in seconds"
                            keyboardType="numeric"
                        />

                    </ThemedView>

                    <ThemedText className="mt-8 text-1xl font-bold">
                        RailReady API server status
                    </ThemedText>
                    <ThemedText>{serverStatus}</ThemedText>

                    {/*Line*/}
                    <View className="w-96 h-px bg-gray-300 dark:bg-gray-700 mt-4" />

                    {/*Image*/}
                    <ThemedView className="w-64 h-64 bg-gray-300 dark:bg-gray-700 rounded-full items-center justify-center mt-10">
                        <Image
                            source={
                                __DEV__
                                    ? require("@/assets/AppIconDev.png")
                                    : require("@/assets/AppIcon.png")
                            }
                            style={{
                                width: 192,
                                height: 192,
                                borderRadius: 50,
                            }} // Pojistka, kdyby NativeWind nepřenesl třídy na expo-image
                            className="w-48 h-48"
                            contentFit="cover"
                        />
                    </ThemedView>

                    {/*Footer*/}
                    <ThemedText
                        className={`text-sm text-center ${Platform.OS !== "web" ? "pb-20" : "pb-8"}`}
                    >
                        © 2026 Jonáš Vondra. Všechna práva vyhrazena. {"\n"}
                    </ThemedText>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}
