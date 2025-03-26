
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./orderitem.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    total: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[];
}