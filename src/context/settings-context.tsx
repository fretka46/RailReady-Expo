import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Settings {
    timerStartSeconds: string;
    notification1: string;
    notification2: string;
    notification3: string;
    station: string;
    stationPresets: Array<string>;
    filterOptions: FilterOptions;
}

const defaultSettings: Settings = {
    timerStartSeconds: "600",
    notification1: "600",
    notification2: "300",
    notification3: "60",
    station: "Praha-Kyje",
    stationPresets: [
        "Praha-Kyje",
        "Praha hl.n.",
        "Praha Masarykovo nádraží",
    ],
    filterOptions: {
        filtersEnabled: false,
        preferedLines: [],
        SLineTrains: true,
        otherTrains: true,
        buses: true,
        trams: true,
        metro: true,
        nightLines: true,
    }
};

interface FilterOptions {
    filtersEnabled: boolean;
    preferedLines: string[];
    SLineTrains: boolean;
    otherTrains: boolean;
    buses: boolean;
    trams: boolean;
    metro: boolean;
    nightLines: boolean;
}


interface SettingsContextData {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(
        key: K,
        value: Settings[K],
    ) => void;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextData | undefined>(
    undefined,
);

export const SettingsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    // Načtení dat při startu aplikace
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettingsBase = await AsyncStorage.getItem(
                    "@railready_settings",
                );
                if (storedSettingsBase) {
                    const parsed = JSON.parse(storedSettingsBase);
                    setSettings((prev) => ({ ...prev, ...parsed }));
                }
            } catch (e) {
                console.error("Failed to load settings", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    // Funkce na aktualizaci jedné hodnoty a rovnou s uložením do AsyncStorage
    const updateSetting = <K extends keyof Settings>(
        key: K,
        value: Settings[K],
    ) => {
        setSettings((prev) => {
            const updated = { ...prev, [key]: value };
            // Ukládáme data na pozadí plynule bez čekání
            AsyncStorage.setItem(
                "@railready_settings",
                JSON.stringify(updated),
            ).catch((e) => console.error("Failed to save settings", e));
            return updated;
        });
    };

    return (
        <SettingsContext.Provider
            value={{ settings, updateSetting, isLoading }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
