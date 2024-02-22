import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import JSZip from 'jszip';

abstract class GTFS {
    constructor(gtfsName: string) {
        this.GTFS_NAME = "gtfs-static/" + gtfsName;

        if (!window.caches) console.warn("This browser does not support Cache!");
        else this.loadCache();
    }

    public async getStatic() : Promise<ArrayBuffer> {
        if (!window.caches)
            return await this.getArrayBuffer(this.STATIC_URL); 
        else
            return await caches.open(this.GTFS_NAME).then(async cache => await cache.match(this.STATIC_URL).then(async match => {
                if (match)
                    return await match.arrayBuffer();
                else {
                    await this.refetchCache();
                    return await this.getArrayBuffer(this.STATIC_URL);
                }
            }))
    }

    public async getRealtimeVehiclePositions() : Promise<GtfsRealtimeBindings.transit_realtime.FeedMessage> {
        return GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(await this.getArrayBuffer(this.REALTIME_VEHICLE_POSITIONS_URL)))
    }

    public async getRealtimeTripUpdates() : Promise<GtfsRealtimeBindings.transit_realtime.FeedMessage> { 
        return GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(await this.getArrayBuffer(this.REALTIME_TRIP_UPDATES_URL)))
    }

    public getName() : string {
        return this.GTFS_NAME;
    }

    private async refetchCache() : Promise<void> {
        if (window.caches){
            try {
                await caches.open(this.GTFS_NAME).then(cache => cache.add(this.STATIC_URL))
            } catch (error) {
                console.error(error);
            }
        }
    }   

    private loadCache() : void {
        // Checks if the data in the contents are old, if they are, refresh the cache
        caches.open(this.GTFS_NAME).then(cache => cache.match(this.STATIC_URL).then(async response => {
            // Checks if the data exists in the cache, if not, refresh it
            if (response) {
                // Checks if the data in the contents are old, if they are, refresh the cache
                JSZip.loadAsync(this.getArrayBuffer(this.STATIC_URL)).then(zip => zip.file("feed_info.txt")?.async("string").then(contents => {
                    const date = new Date() // Today's Date

                    // Compare the old date to the new date, formatted in (yyyymmdd)
                    if (Number(contents.split(/,/)[1].split(/,/)[5]) < Number([date.getFullYear(), date.getMonth(), date.getDate()].join()))
                        this.refetchCache();
                }))
            } else this.refetchCache();
        }))
    }

    private readonly GTFS_NAME : string;
    
    protected abstract getArrayBuffer(url : string) : Promise<ArrayBuffer>;
    
    protected abstract readonly STATIC_URL : string;
    protected abstract readonly REALTIME_VEHICLE_POSITIONS_URL : string;
    protected abstract readonly REALTIME_TRIP_UPDATES_URL : string;
    protected abstract readonly REALTIME_SERVICE_ALERTS_URL : string;
}

export default GTFS;