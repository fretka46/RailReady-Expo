import { Settings } from "@/context/settings-context";
import Train, { trains, trainsBack } from "./train";

export let isUpdating: boolean = false;

export function updateData(settings: Settings) {
  // Check if valid internet connection is available
  if (!navigator.onLine) {
    console.warn("No internet connection. Skipping data update.");
    return;
  }

    if (isUpdating) {
        console.warn("Data update already in progress. Skipping.");
        return;
    }

    isUpdating = true;
    console.log("Starting data update...");

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


    fetch(fullUrl, {
        headers: {
            "X-Access-Token": settings.golemioApiKey,
        },
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                console.error(`Response body: ${response.statusText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        })
        .then((data) => {
            console.log("Data fetched successfully");

            if (data.departures && data.departures.length > 0) {
                // Vyprázdnění starých dat
                trains.length = 0;
                trainsBack.length = 0;

                for (const departure of data.departures) {
                    const params: Partial<Train> = {
                        headsign: departure.trip.headsign,
                        departureTime: new Date(departure.departure_timestamp.predicted),
                        line: departure.route.short_name,
                        delay_seconds: departure.delay.seconds || 0,
                        isDelayValid: departure.delay.is_available,
                        // Tady si pripadne pridej display_fix pokud ho budes potrebovat
                        last_stop: departure.last_stop.name,
                        scheduledTime: new Date(departure.departure_timestamp.scheduled),
                        id: departure.trip.id
                    };

                    const newTrain = new Train(params);

                    const primary_destinations = settings.destinations.split(",").map(dest => dest.trim());
                    if (primary_destinations.includes(departure.trip.headsign)) {
                        trains.push(newTrain);
                    } else {
                        trainsBack.push(newTrain);
                    }
                    
                }
            } else {
                console.log("No departures found");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        })
        .finally(() => {
            isUpdating = false;
        });

}   