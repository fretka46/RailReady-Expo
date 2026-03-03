export default class Train {
    public headsign: string;
    public departureTime: Date;
    public scheduledTime: Date;
    public line: string;
    public isDelayValid: boolean;
    public delay_seconds: number;
    public last_stop: string;
    public id: string;

    constructor(TrainData: Partial<Train>) {
        this.headsign = TrainData.headsign || "";
        this.departureTime = TrainData.departureTime ? new Date(TrainData.departureTime) : new Date();
        this.scheduledTime = TrainData.scheduledTime ? new Date(TrainData.scheduledTime) : new Date();
        this.line = TrainData.line || "";
        this.isDelayValid = TrainData.isDelayValid || false;
        this.delay_seconds = TrainData.delay_seconds || 0;
        this.last_stop = TrainData.last_stop || "";
        this.id = TrainData.id || "";
    }

    public departuresIn(): number {
        const now = new Date();
        const departureTimeWithDelay = new Date(this.departureTime.getTime() + this.delay_seconds * 1000);
        return Math.max(0, Math.floor((departureTimeWithDelay.getTime() - now.getTime()) / 1000));
    }

    public formattedDelay(): string {
        if (!this.isDelayValid) return "00:00";
        let sign = "";
        if (this.delay_seconds > 0) sign = "+";
        else if (this.delay_seconds < 0) sign = "-";

        const absDelay = Math.abs(this.delay_seconds);
        const minutes = Math.floor(absDelay / 60);
        const seconds = absDelay % 60;
        return `${sign}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    public toString(): string {
        return `Train ${this.line}, ID: ${this.id}`;
    }
}

// Global state for trains queue
export let trains: Train[] = [];
export let trainsBack: Train[] = [];

export let currentTrainIndex: number = 0;
export let isBack: boolean = false;

export function getTrain(): Train | null {
    try {
        const currentArray = isBack ? trainsBack : trains;
        if (currentTrainIndex >= 0 && currentTrainIndex < currentArray.length) {
            return currentArray[currentTrainIndex];
        } else {
            console.warn(`IndexError: ${currentTrainIndex} out of range for trains array`);
            currentTrainIndex = 0; // Reset index to prevent further errors
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function moveIndex(forward: boolean) {
    const currentArray = isBack ? trainsBack : trains;
    const maxIndex = currentArray.length - 1;

    if (forward) {
        currentTrainIndex = currentTrainIndex < maxIndex ? currentTrainIndex + 1 : currentTrainIndex;
    } else {
        currentTrainIndex = currentTrainIndex > 0 ? currentTrainIndex - 1 : currentTrainIndex;
    }

    console.log(`Moved index ${forward ? "forward" : "backward"} to ${currentTrainIndex}`);
}
