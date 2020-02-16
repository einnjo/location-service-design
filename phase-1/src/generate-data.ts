import { Chance } from 'chance';
import cuid from 'cuid';

const chance = Chance();

export function createDevices(num: number) {
  const devices = [];
  for (let i = 0; i < num; i++) {
    devices.push(createDevice());
  }

  return devices;
}

function createDevice() {
  return {
    deviceId: cuid(),
    lat: chance.latitude({ min: 52.482877, max: 52.549812 }),
    long: chance.longitude({ min: 13.330158, max: 13.465269 }),
    timestamp: chance.timestamp(),
  };
}
