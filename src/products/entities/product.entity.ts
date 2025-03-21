import { Column, Decimal128, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {
@PrimaryGeneratedColumn()
id: number;
@Column()
name: string;
@Column({type:'decimal', precision: 10, scale: 2})
price: number;
}
