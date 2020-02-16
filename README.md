# Location Service

## Problem Statement

We are the owners of a decently sized (~50k) fleet of ride-sharing scooters operating in a densely populated capital city in europe.
We want to be able to monitor the position of our fleet within any 10km2 area inside our AO (area of operations).
We expect the location to be as near real time as possible (< 1 minute lag).

### Use cases

- Locate all devices inside any 10km2 area inside AO.
- Locate a device given its id.

### Scale calculations

Assume population density of 25k people / km2.
Assume the number of devices needed to service 1km2 is 5% of its population density.

Expected number of devices per km2 = `25_000 * 0.05 = 1_250`
Expected number of devices inside 10km2 granularity area = `1_250 * 10 = 12_500`

Assume data payload for each location update is `110B`

```json
{
  "deviceId": "cjld2cyuq0000t3rmniod1foy",
  "lat": -00.000000,
  "long": 000.000000,
  "timestamp": 1581464672
}
```

Assume device location updates per minute is `2`

Expected requests per second = `(50_000 * 2) / 60 = ~1_166`
Expected total requests per month = `50_000 * 2 * 60 * 24 * 30 = 4_320_000_000`
Expected data ingestion per second = `1_166 * 110 = ~183_333B = ~183KB`
Expected data ingestion per month = `183 * 60 * 60 * 24 * 30 = 47_300_000_000 B = ~474GB`

### Datamodel

device_location

```
deviceId    UID
lat         DECIMAL
long        DECIMAL
timestamp   TIMESTAMP
```

### API

```
findById(deviceId: string): DeviceLocation
findByLatLong(lat: number, long: number): DeviceLocation[]
```
