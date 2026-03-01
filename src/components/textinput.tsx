import React, { forwardRef } from "react";
import {
    TextInput as RNTextInput,
    TextInputProps,
    useColorScheme,
} from "react-native";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
    ({ className, placeholderTextColor, ...props }, ref) => {
        // Získáme aktuální systémové téma, abychom mohli přizpůsobit nativní prvky
        const colorScheme = useColorScheme();

        // Typické barvy placeholderu pro iOS
        const defaultPlaceholderColor =
            colorScheme === "dark" ? "#98989f" : "#8e8e93";

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
                // Omezí nechtěné blikání autokorekce do jiných barev atp.
                {...props}
            />
        );
    },
);

TextInput.displayName = "TextInput";
