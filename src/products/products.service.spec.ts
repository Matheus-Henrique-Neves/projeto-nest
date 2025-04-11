import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository :Repository<Product>;
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, {
        provide: getRepositoryToken(Product),
        useValue: mockRepository
      }],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('deve criar um produto', async () => {
      const productdto:CreateProductDto = {name:"Produto1",price:9.99};
      const product ={id:1,name:"Produto1",price:9.99};
      mockRepository.create.mockResolvedValue(productdto)
      mockRepository.save.mockResolvedValue(product)
      const result = await service.create(productdto)
      expect(result).toEqual(product)

    })
  })
  describe('findAll', () => {
    it('deve retornar um array de Products', async () => {
      const products = [
        {id: 1, name: 'Teste', price: 9.99},
        {id: 2, name: 'Teste2', price: 10.50}
      ]
      mockRepository.find.mockResolvedValue(products)
      const result = await service.findAll();
      expect(result).toEqual(products)
    })
  })
  describe('findOne', () => {
    it('deve retornar um product pelo id', async () => {
      const product = {id: 1, name: 'Teste', price: 9.99}
      mockRepository.findOneBy.mockResolvedValue(product)

      const result = await service.findOne(1)
      expect(result).toEqual(product)
    })

    it('deve retornar um erro se o product não for encontrado', async () => {
      const productId = -1;
      mockRepository.findOneBy.mockResolvedValue(undefined);

      
      await expect(service.findOne(productId)).rejects.toThrow(NotFoundException);
    });    
  })
  describe('update', () => {
    it('deve atualizar um product', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Nome alterado' };
      const product = {id: 1, name: 'Nome', email: 'email@email.com'};
      const updatedProduct = { ...product, ...updateProductDto };

      mockRepository.findOneBy.mockResolvedValue(product);
      mockRepository.merge.mockResolvedValue(updatedProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateProductDto);
      expect(result).toEqual(updatedProduct);
    })
  })
  describe('remove', () => {
    it('deve remover um product', async () => {
      const product = {id: 1, name: 'Teste', price: 10 }
      mockRepository.findOneBy.mockResolvedValue(product)
      mockRepository.remove.mockResolvedValue(product)

      const result = await service.remove(1)
      expect(result).toEqual(product)
    })
  })
});
