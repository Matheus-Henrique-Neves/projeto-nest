import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  products: CreateOrderItemDto[];

  @IsNumber()
  userId: number;
}

export class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  productId: number;
}
