import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Settings interface
interface Settings {
  // Route settings
  stationName: string;
  destinationNames: string;
  apiKey: string;

  // App settings
  progressbarOffset: number;
  // notification times
  notification1: number;
  notification2: number;
  notification3: number;
}

// Define the context type
interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

// Create the context with default values
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Define the provider props
interface SettingsProviderProps {
  children: ReactNode;
}

// Create the SettingsProvider component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    // Route settings
    stationName: '',
    destinationNames: '',
    apiKey: '',

    // App settings
    progressbarOffset: 600,
    // notification times
    notification1: 60,
    notification2: 300,
    notification3: 600,
  });

  // Load settings from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          console.log('Loaded settings:', parsedSettings); // Log loaded settings
          setSettings((prevSettings) => ({
            ...prevSettings,
            ...parsedSettings,
          }));
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
        console.log('Saved settings:', settings); // Log saved settings
      } catch (error) {
        console.error('Failed to save settings', error);
      }
    };

    saveSettings();
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Create a custom hook to use the SettingsContext
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;