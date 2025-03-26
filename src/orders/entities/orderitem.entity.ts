import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entities/product.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    price: number;

    @Column()
    total: number;

    @Column()
    orderId: number;

    @Column()
    productId: number;

    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ManyToOne(() => Product, (product) => product.items)
    @JoinColumn({ name: 'productId' })
    product: Product;

}