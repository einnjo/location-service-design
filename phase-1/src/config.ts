import * as envalid from 'envalid';
import path from 'path';

const { num } = envalid;

export class Config {
  public static fromEnv(): Config {
    const env = envalid.cleanEnv(
      process.env,
      {
        GEOHASH_CACHE_TTL: num(),
        GEOHASH_CACHE_MAX: num(),
        DEVICE_CACHE_TTL: num(),
        DEVICE_CACHE_MAX: num(),
        GEOHASH_PRECISION: num(),
      },
      { strict: true, dotEnvPath: path.resolve(__dirname, '../.env') },
    );
    return new Config(
      env.GEOHASH_CACHE_TTL,
      env.GEOHASH_CACHE_MAX,
      env.DEVICE_CACHE_TTL,
      env.DEVICE_CACHE_MAX,
      env.GEOHASH_PRECISION,
    );
  }

  constructor(
    public readonly GEOHASH_CACHE_TTL: number,
    public readonly GEOHASH_CACHE_MAX: number,
    public readonly DEVICE_CACHE_TTL: number,
    public readonly DEVICE_CACHE_MAX: number,
    public readonly GEOHASH_PRECISION: number,
  ) {}
}

export const configProvider = {
  provide: Config,
  useFactory: async () => {
    return Config.fromEnv();
  },
};
