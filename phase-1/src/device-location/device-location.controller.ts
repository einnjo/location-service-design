import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  HttpException,
  HttpStatus,
  Header,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { LocationDto } from './dto/location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { DeviceLocationService } from './device-location.service';
import { GetNearLocationQueryDto } from './dto/get-near-location-query.dto';
import { DeviceLocatedEvent, DeviceLocationEvents } from './device-location.events';

@ApiTags('device-location')
@Controller('device-locations')
export class DeviceLocationController {
  constructor(
    private readonly locationService: DeviceLocationService,
    private readonly events: DeviceLocationEvents,
  ) {}

  @Put('devices/:deviceId')
  @ApiOperation({ summary: 'Update the location of a device.' })
  async updateLocation(
    @Param('deviceId') deviceId: string,
    @Body() params: UpdateLocationDto,
  ): Promise<void> {
    const geohash = this.locationService.getGeohash(params.lat, params.long);
    this.locationService.update({ ...params, geohash, deviceId });
  }

  @Get('devices/:deviceId')
  @ApiOperation({ summary: 'Get the location of a specific device.' })
  async getLocation(@Param('deviceId') deviceId: string): Promise<LocationDto> {
    const device = this.locationService.findDeviceById(deviceId);
    if (device === undefined) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    return device;
  }

  @Get('devices')
  @ApiOperation({ summary: 'Get all devices around a lat, long position.' })
  async getNearLocation(@Query() query: GetNearLocationQueryDto) {
    const { lat, long } = query;
    const geohash = this.locationService.getGeohash(lat, long);
    const devices = this.locationService.findDevicesByGeohash(geohash);

    return devices;
  }

  @ApiTags('event')
  @Get('events/devices/:deviceId')
  @ApiOperation({ summary: 'Subscribe to location events for a specific device.' })
  @Header('Content-Type', 'text/event-stream')
  @Header('Connection', 'keep-alive')
  @Header('Cache-Control', 'no-cache')
  trackDevice(@Req() req: Request, @Res() res: Response) {
    const subscription = this.events.subscribeToDevice(req.params.deviceId, {
      next: (event: DeviceLocatedEvent) => res.write(`${JSON.stringify(event)}\n`),
    });

    req.on('close', () => {
      subscription.unsubscribe();
    });
  }

  @ApiTags('event')
  @Get('events/geohash/:geohash')
  @ApiOperation({ summary: 'Subscribe to location events for a specific area.' })
  @Header('Content-Type', 'text/event-stream')
  @Header('Connection', 'keep-alive')
  @Header('Cache-Control', 'no-cache')
  trackNearLocation(@Req() req: Request, @Res() res: Response) {
    const subscription = this.events.subscribeToGeohash(req.params.geohash, {
      next: (event: DeviceLocatedEvent) => res.write(`${JSON.stringify(event)}\n`),
    });

    req.on('close', () => {
      subscription.unsubscribe();
    });
  }
}
