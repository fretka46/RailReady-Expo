import { Settings } from "@/context/settings-context";
import * as Network from "expo-network";
import { trains, trainsBack } from "./train";
import * as Train from "./train";

export let isUpdating: boolean = false;

export async function updateData(settings: Settings) {
    const state = await Network.getNetworkStateAsync();
    const isConnected = state.isConnected;
    const isInternetReachable = state.isInternetReachable;
    const connectionType = state.type;

    console.log("Starting data update...");
    console.debug("Connnection type:", connectionType + ", isConnected:", isConnected + ", isInternetReachable:", isInternetReachable);

  // Check if valid internet connection is available
    if (!isConnected || !isInternetReachable) {
        console.warn("No internet connection. Skipping data update.");
        return;
    }

    if (isUpdating) {
        console.warn("Data update already in progress. Skipping.");
        return;
    }

    isUpdating = true;

    const url = `https://api.railready.fretka.me/`;

    const params = new URLSearchParams({
        "station": settings.station
    });

    const fullUrl = `${url}?${params.toString()}`;

    try {
        const response = await fetch(fullUrl);

        if (!response.ok) {
            console.warn(`Unexpected status: ${response.status}`);
            console.warn(`Response body: ${await response.text()}`);
            return;
        }

        const data = await response.json();

        console.log("Succesfully received:", data.departures ? data.departures.length : 0 + " departures");

        if (data.departures && data.departures.length > 0) {
            // Save old trains for comparison
            const oldTrains = [...trains];
            const oldTrainsBack = [...trainsBack];

            // Vyprázdnění starých dat
            trains.length = 0;
            trainsBack.length = 0;

            for (const departure of data.departures) {
                const params: Partial<Train.default> = {
                    headsign: displayFix(departure.headsign),
                    departureTime: new Date(departure.departureTime),
                    line: departure.line,
                    delay_seconds: departure.delay_seconds || 0,
                    isDelayValid: departure.isDelayValid,
                    last_stop: departure.last_stop,
                    scheduledTime: new Date(departure.scheduledTime),
                    id: departure.id,
                };

                const newTrain = new Train.default(params);

                if (newTrain.isDelayValid == false) {
                    // Pokus o získání zpoždění z předchozího stavu, pokud je dostupný
                    const matchingOldTrain = oldTrains.find(train => train.id === newTrain.id) || oldTrainsBack.find(train => train.id === newTrain.id);
                    if (matchingOldTrain) {
                        newTrain.delay_seconds = matchingOldTrain.delay_seconds;
                        if (!newTrain.last_stop)
                            newTrain.last_stop = matchingOldTrain.last_stop;
                    }
                }

                if (departure.direction === false) {
                    trains.push(newTrain);
                } else {
                    trainsBack.push(newTrain);
                }

            }
        } else {
            console.log("No departures found");
            // Clear existing data if no departures are returned to avoid showing stale data
            trains.length = 0;
            trainsBack.length = 0;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        console.log("Data update completed with", trains.length, "primary and", trainsBack.length, "back departures");

        // Check if current train is in the same index after update, if not adjust it
        const currentArray = Train.isBack ? trainsBack : trains;
        const curretnTrain = Train.getTrain();
        const currentTrainId = curretnTrain ? curretnTrain.id : null;

        if (currentTrainId && Train.currentTrainIndex != 0) {
            const newIndex = currentArray.findIndex(train => train.id === currentTrainId);
            if (newIndex != Train.currentTrainIndex) {
                console.log(`Current train index adjusted from ${Train.currentTrainIndex} to ${newIndex} after data update.`);
                Train.setIndex(newIndex >= 0 ? newIndex : 0); // If train is not found, reset to 0
            }
        }

        isUpdating = false;
    }

}   

function displayFix(headsign: string): string {

    if (headsign == "hr.VUSC 0100/0200 04") {
        return "Uvaly - Stamberk";
    } else if (headsign == "P.Běchovice-Blatov") {
        return "Bechovice - Blatov";
    }
    return headsign;
}