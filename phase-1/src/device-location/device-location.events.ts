import { Subject, PartialObserver } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';

export interface DeviceLocatedEvent {
  deviceId: string;
  geohash: string;
  lat: number;
  long: number;
  timestamp: number;
}

@Injectable()
export class DeviceLocationEvents {
  private readonly stream: Subject<DeviceLocatedEvent> = new Subject<DeviceLocatedEvent>();

  publish(event: DeviceLocatedEvent) {
    this.stream.next(event);
  }

  subscribe(obs: PartialObserver<DeviceLocatedEvent>) {
    return this.stream.subscribe(obs);
  }

  subscribeToDevice(deviceId: string, obs: PartialObserver<DeviceLocatedEvent>) {
    return this.stream.pipe(this.filterByDeviceId(deviceId)).subscribe(obs);
  }

  subscribeToGeohash(geohash: string, obs: PartialObserver<DeviceLocatedEvent>) {
    return this.stream.pipe(this.filterByGeohash(geohash)).subscribe(obs);
  }

  private filterByDeviceId(deviceId: string) {
    return filter((event: DeviceLocatedEvent) => event.deviceId === deviceId);
  }

  private filterByGeohash(geohash: string) {
    return filter((event: DeviceLocatedEvent) => event.geohash === geohash);
  }
}
