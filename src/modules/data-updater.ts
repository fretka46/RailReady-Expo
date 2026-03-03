import { Settings } from "@/context/settings-context";
import * as Network from "expo-network";
import Train, { trains, trainsBack } from "./train";

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

    // Generate URL
    const url = `https://api.golemio.cz/v2/pid/departureboards`;

    const params = new URLSearchParams({
        //"ids": "U1051Z301",
        "names": settings.station,
        "minutesBefore": "0",
        "minutesAfter": "60",
        "preferredTimezone": "Europe/Prague",
        "mode": "departures",
        "order": "real",
        "filter": "routeOnceFill",
        "skip": "canceled",
        "limit": "40",
        "offset": "0"
    })

    const fullUrl = `${url}?${params.toString()}`;


    try {
        const response = await fetch(fullUrl, {
            headers: {
                "X-Access-Token": settings.golemioApiKey,
            },
        });

        if (!response.ok) {
            console.warn(`Unexpected status: ${response.status}`);
            console.warn(`Response body: ${await response.text()}`);
            return;
        }

        const data = await response.json();


        console.log("Data fetched successfully");
        console.log("Departures received:", data.departures ? data.departures.length : 0);

        if (data.departures && data.departures.length > 0) {
            // Vyprázdnění starých dat
            trains.length = 0;
            trainsBack.length = 0;

            const primary_destinations = settings.destinations.split(",").map((dest) => dest.trim());
            console.debug("Primary destinations:", primary_destinations);

            for (const departure of data.departures) {
                const params: Partial<Train> = {
                    headsign: displayFix(departure.trip.headsign),
                    departureTime: new Date(departure.departure_timestamp.predicted),
                    line: departure.route.short_name,
                    delay_seconds: departure.delay.seconds || 0,
                    isDelayValid: departure.delay.is_available,
                    last_stop: departure.last_stop.name,
                    scheduledTime: new Date(departure.departure_timestamp.scheduled),
                    id: departure.trip.id,
                };

                const newTrain = new Train(params);

                if (primary_destinations.includes(departure.trip.headsign)) {
                    trains.push(newTrain);
                } else {
                    trainsBack.push(newTrain);
                }

            }
        } else {
            console.log("No departures found");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        console.log("Data update completed with", trains.length, "primary and", trainsBack.length, "back departures");
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