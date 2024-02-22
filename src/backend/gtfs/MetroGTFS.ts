import GTFS from "./GTFS.ts";

class MetroGTFS extends GTFS {
    constructor() {
        super("metro");
    }

    public async getArrayBuffer(url: string): Promise<ArrayBuffer> {
        return await fetch(url).then(async response => await response?.arrayBuffer());
    }

    protected readonly STATIC_URL = "https://svc.metrotransit.org/mtgtfs/gtfs.zip";
    protected readonly REALTIME_VEHICLE_POSITIONS_URL = 'https://svc.metrotransit.org/mtgtfs/vehiclepositions.pb';
    protected readonly REALTIME_TRIP_UPDATES_URL = 'https://svc.metrotransit.org/mtgtfs/tripupdates.pb';
    protected readonly REALTIME_SERVICE_ALERTS_URL = 'https://svc.metrotransit.org/mtgtfs/alerts.pb';
}

export default MetroGTFS;