import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { DeviceLocationModule } from './device-location/device-location.module';
import { configProvider } from './config';

@Module({
  imports: [DeviceLocationModule, LoggerModule.forRoot()],
  providers: [configProvider],
})
export class AppModule {}
