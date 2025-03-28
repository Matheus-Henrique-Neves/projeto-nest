import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderItem } from './entities/orderitem.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
     @InjectRepository(Order)
     private ordersRepository: Repository<Order>,
     @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const produtos = await this.productsRepository.find({
      where: {
        id: In(createOrderDto.products.map((produto) => produto.productId))
      }
    });

    const total = produtos.reduce((acc, product) => {
      const item = createOrderDto.products.find(
        (item) => item.productId === product.id
      );

      if(!item) return acc

      return acc + product.price * item.quantity;
    }, 0)

  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
