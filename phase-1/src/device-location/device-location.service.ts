import { Inject, Injectable } from '@nestjs/common';
import Geohash from 'ngeohash';
import { DeviceLocationEvents } from './device-location.events';
import { DEVICE_CACHE, GEOHASH_CACHE } from './tokens';
import { Cache } from './cache';
import { Config } from '../config';

@Injectable()
export class DeviceLocationService {
  constructor(
    @Inject(GEOHASH_CACHE) private readonly geohashCache: Cache<string, DeviceLocationMap>,
    @Inject(DEVICE_CACHE) private readonly deviceCache: Cache<string, DeviceLocation>,
    private readonly events: DeviceLocationEvents,
    private readonly config: Config,
  ) {}

  public update(deviceLocation: DeviceLocation): void {
    this.addToDeviceLookup(deviceLocation);
    this.addToGeohashLookup(deviceLocation);
    this.events.publish(deviceLocation);
  }

  public findDeviceById(deviceId: string): DeviceLocation | undefined {
    return this.deviceCache.get(deviceId);
  }

  public findDevicesByGeohash(geohash: string): DeviceLocationMap {
    const deviceLocationMap = this.geohashCache.get(geohash) || {};

    return deviceLocationMap;
  }

  public getGeohash(lat: number, long: number): string {
    return Geohash.encode(lat, long, this.config.GEOHASH_PRECISION);
  }

  private addToDeviceLookup(deviceLocation: DeviceLocation): void {
    const { deviceId } = deviceLocation;
    this.deviceCache.set(deviceId, deviceLocation);
  }

  private addToGeohashLookup(deviceLocation: DeviceLocation): void {
    const { deviceId, geohash } = deviceLocation;

    const deviceLocationMap = this.geohashCache.get(geohash) || {};
    deviceLocationMap[deviceId] = deviceLocation;

    this.geohashCache.set(geohash, deviceLocationMap);
  }
}

export interface DeviceLocation {
  deviceId: string;
  geohash: string;
  lat: number;
  long: number;
  timestamp: number;
}

export interface DeviceLocationMap {
  [deviceId: string]: DeviceLocation;
}
