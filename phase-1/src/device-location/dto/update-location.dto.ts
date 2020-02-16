import { IsLatitude, IsLongitude, IsInt, Min } from 'class-validator';

export class UpdateLocationDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  long: number;

  @IsInt()
  @Min(0)
  timestamp: number;
}
