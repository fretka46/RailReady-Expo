import { ExternalLink } from "@/components/external-link";
import { TextInput } from "@/components/textinput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { ScrollView, View } from "react-native";

export default function ExploreScreen() {
    return (
        <ScrollView>
            <ThemedView className="flex-1 items-center justify-center ">
                <ThemedText className="text-4xl font-bold mb-4">
                    RailReady
                </ThemedText>
                <ThemedText className="text-lg text-center px-4">
                    by Jonáš Vondra - v1.0.0
                </ThemedText>

                {/*Line*/}
                <View className="w-96 h-px bg-gray-300 dark:bg-gray-700 mt-4 mb-12" />

                <ThemedView className="w-full px-8">
                    <ThemedText className="text-2xl font-bold">
                        Začátek odpočtu časovače
                    </ThemedText>
                    <ThemedText className="text-sm mb-2">
                        Čas v sekundách kdy začne grafický časovač odpočítavat
                        do odjezdu vlaku. (např. 600 = 10 minut před odjezdem)
                    </ThemedText>
                    <TextInput
                        className="w-32 text-center"
                        defaultValue="600"
                        placeholder="Time in seconds"
                        keyboardType="numeric"
                    />

                    <ThemedText className="text-2xl font-bold mt-8">
                        Notifikace
                    </ThemedText>
                    <ThemedText className="text-sm mb-2">
                        V jaký časy mají chodit notifikace před odjezdem.
                        nastavení -1 notifikaci vypne
                    </ThemedText>
                    <ThemedView className="flex-row">
                        <ThemedView>
                            <ThemedText className="text-sm mb-1 mr-10">
                                {" "}
                                1. Notifikace{" "}
                            </ThemedText>
                            <TextInput
                                className="w-24 text-center"
                                defaultValue="600"
                                placeholder="sekundy"
                                keyboardType="numeric"
                            />
                        </ThemedView>
                        <ThemedView>
                            <ThemedText className="text-sm mb-1 mr-10">
                                {" "}
                                2. Notifikace{" "}
                            </ThemedText>
                            <TextInput
                                className="w-24 text-center"
                                defaultValue="300"
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
                                defaultValue="60"
                                placeholder="sekundy"
                                keyboardType="numeric"
                            />
                        </ThemedView>
                    </ThemedView>

                    <ThemedText className="mt-10 text-2xl font-bold">
                        Sledovaná stanice
                    </ThemedText>
                    <ThemedText className="text-sm mb-2">
                        Přesný název stanice, kterou chcete sledovat. (např.
                        "Praha hl.n."). Seznam stanic najdete na{" "}
                        <ExternalLink
                            className="text-blue-500 underline"
                            href="http://programs46.9e.cz/railready/stops.txt"
                        >
                            https://railready.fretka.me/
                        </ExternalLink>
                        {"\n"}(použijte vyhledávání v prohlížeči)
                    </ThemedText>
                    <TextInput
                        className="w-72"
                        defaultValue="Praha-Kyje"
                        placeholder="Přesný název stanice"
                    />

                    <ThemedText className="mt-10 text-2xl font-bold">
                        Cílové stanice
                    </ThemedText>
                    <ThemedText className="text-sm mb-2">
                        Stejné názvy jako mají vlaky na svých směrových
                        cedulích, oddělené čárkou. Vlaky s těmtito cílovými
                        stanicemi budou považovány za primární směr jízdy.
                    </ThemedText>
                    <TextInput
                        className="w-96"
                        defaultValue="Praha Masarykovo nádr., Praha hl n., Karlštejn"
                        placeholder="Praha Masarykovo nádr., Praha hl n., Karlštejn"
                    />

                    <ThemedText className="mt-10 text-2xl font-bold">
                        Golemio API key
                    </ThemedText>
                    <ThemedText className="text-sm mb-2">
                        Vygenerovaný klíč k golemio API. Získat ho můžete zde:{" "}
                        {"\n"}
                        <ExternalLink
                            className="text-blue-500 underline"
                            href="https://api.golemio.cz/api-keys/"
                        >
                            https://api.golemio.cz/api-keys/
                        </ExternalLink>
                    </ThemedText>
                    <TextInput className="w-72" placeholder="Golemio API key" />
                </ThemedView>

                {/*Line*/}
                <View className="w-96 h-px bg-gray-300 dark:bg-gray-700 mt-12" />

                {/*Image*/}
                <ThemedView className="w-64 h-64 bg-gray-300 dark:bg-gray-700 rounded-full items-center justify-center mt-10">
                    <Image
                        source={require("@/assets/AppIcon.png")}
                        style={{ width: 192, height: 192, borderRadius: 50 }} // Pojistka, kdyby NativeWind nepřenesl třídy na expo-image
                        className="w-48 h-48"
                        contentFit="cover"
                    />
                </ThemedView>

                {/*Footer*/}
                <ThemedText className="text-sm text-center mb-4">
                    © 2026 Jonáš Vondra. Všechna práva vyhrazena. {"\n"}
                </ThemedText>
            </ThemedView>
        </ScrollView>
    );
}
