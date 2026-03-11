import React, { forwardRef, useState, useEffect, useRef } from "react";
import {
    TextInput as RNTextInput,
    TextInputProps,
    useColorScheme,
} from "react-native";

export interface CustomTextInputProps extends TextInputProps {
    /** 
     * Time (in ms) to wait after typing stops before calling onChangeText.
     * Default is 1200ms. Set to 0 to disable debouncing.
     */
    debounceDelay?: number;
}

export const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(
    ({ className, placeholderTextColor, debounceDelay = 1200, value, onChangeText, ...props }, ref) => {
        const colorScheme = useColorScheme();
        const defaultPlaceholderColor = colorScheme === "dark" ? "#98989f" : "#8e8e93";

        // Lokální state pro plynulé psaní
        const [localValue, setLocalValue] = useState(value as string | undefined);
        const timeoutRef = useRef<NodeJS.Timeout | null>(null);

        // Kdykoliv se změní hodnota "zvenčí" (například kliknutím na předvolbu),
        // propíšeme ji i do lokálního stavu.
        useEffect(() => {
            if (value !== undefined && value !== localValue) {
                setLocalValue(value as string);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value]);

        const handleChangeText = (text: string) => {
            setLocalValue(text);
            
            if (debounceDelay > 0) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    onChangeText && onChangeText(text);
                }, debounceDelay);
            } else {
                onChangeText && onChangeText(text);
            }
        };

        return (
            <RNTextInput
                ref={ref}
                // w-full = na plnou šířku kontejneru
                // h-12 px-4 = fixní výška a padding pro správné vertikální centrování textu
                // text-base = typická výchozí velikost písma (16px, dobré kvůli zoomu na iOS)
                // bg-gray-100 / bg-neutral-800 = typická šeď aplikací na iOS
                className={`w-full h-12 px-2 pt-2 pb-5 rounded-xl align-middle text-base bg-[#e5e5ea] dark:bg-[#1c1c1e] text-black dark:text-white ${className || ""}`}
                placeholderTextColor={
                    placeholderTextColor || defaultPlaceholderColor
                }
                // Nativní klávesnice pro iOS se zbarví zčerna/do běla
                keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
                // Přepsané values pro Debounce chování
                value={localValue}
                onChangeText={handleChangeText}
                // Omezí nechtěné blikání autokorekce do jiných barev atp.
                {...props}
            />
        );
    },
);

TextInput.displayName = "TextInput";
