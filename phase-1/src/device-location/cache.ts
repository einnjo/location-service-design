import { TTLCache } from '@brokerloop/ttlcache';

import { GEOHASH_CACHE, DEVICE_CACHE } from './tokens';
import { Config } from '../config';

export interface Cache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
}

export const deviceCacheProvider = {
  provide: DEVICE_CACHE,
  useFactory: (config: Config) => {
    return new TTLCache({
      ttl: config.DEVICE_CACHE_TTL,
      max: config.DEVICE_CACHE_MAX,
    });
  },
  inject: [Config],
};

export const geohashCacheProvider = {
  provide: GEOHASH_CACHE,
  useFactory: (config: Config) => {
    return new TTLCache({
      ttl: config.GEOHASH_CACHE_TTL,
      max: config.GEOHASH_CACHE_MAX,
    });
  },
  inject: [Config],
};
