import { IsLatitude, IsLongitude } from 'class-validator';

export class GetNearLocationQueryDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  long: number;
}
