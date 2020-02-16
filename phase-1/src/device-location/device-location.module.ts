import { Module } from '@nestjs/common';

import { geohashCacheProvider, deviceCacheProvider } from './cache';
import { DeviceLocationController } from './device-location.controller';
import { DeviceLocationService } from './device-location.service';
import { DeviceLocationEvents } from './device-location.events';
import { configProvider } from '../config';

@Module({
  controllers: [DeviceLocationController],
  providers: [
    DeviceLocationService,
    geohashCacheProvider,
    deviceCacheProvider,
    DeviceLocationEvents,
    configProvider,
  ],
})
export class DeviceLocationModule {}
