import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";




export class CreateProductDto {
    @IsNotEmpty({message: 'O campo nome é obrigatório'})
    name: string;
    @IsNotEmpty({message: 'O campo preço é obrigatório'})
    @IsNumber({}, {message: 'O campo preço deve ser um número'})
    @IsPositive({message: 'O campo preço deve ser um número positivo'})
    price: number;
}
