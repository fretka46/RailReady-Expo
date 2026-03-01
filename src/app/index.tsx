import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function IndexScreen() {
    return (
        <ThemedView className="flex-1 items-center justify-center ">
          <ThemedText className="text-4xl bg-red-500">
            AHOJ
          </ThemedText>
        </ThemedView>
        
    );
}
