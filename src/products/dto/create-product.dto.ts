import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsNotEmpty({ message: 'Preço é obrigatório' })
  @IsPositive()
  @IsNumber({}, { message: 'Preço deve ser um número' })
  price: number;
}
