import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getRepositoryToken(User),
        useValue: mockRepository
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar um array de Users', async () => {
      const users = [
        {id: 1, name: 'Teste', email: 'teste@teste.com', password: 'teste'},
        {id: 2, name: 'Teste2', email: 'teste2@teste.com', password: 'teste'}
      ]

      mockRepository.find.mockResolvedValue(users)
      const result = await service.findAll();
      expect(result).toEqual(users)
    })
  })

  describe('findOneByEmail', () => {
    it('deve retornar um user pelo email', async () => {
      const user = {id: 1, name: 'Teste', email: 'email@email.com', password: 'teste'}
      mockRepository.findOneBy.mockResolvedValue(user)

      const result = await service.findOneByEmail('email@email.com')
      expect(result).toEqual(user)
    })

    it('deve retornar um erro se o user não for encontrado', async () => {
      const email = 'email@naoexiste.com';
      mockRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.findOneByEmail(email)).rejects.toThrow(NotFoundException);
    });
  })

  describe('create', () => {
    it('deve criar um novo user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Teste',
        email: 'teste@teste.com',
        password: 'senha'
      }

      const hashSenha = 'senhaHash'
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashSenha)
      const user = {id: 1, ...createUserDto, password: hashSenha}

      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto)
      console.log(result)
      expect(result).toEqual(user);
    })
  })

  describe('update', () => {
    it('deve atualizar um user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Nome alterado' };
      const user = {id: 1, name: 'Nome', email: 'email@email.com'};
      const updatedUser = { ...user, ...updateUserDto };

      mockRepository.findOneBy.mockResolvedValue(user);
      mockRepository.merge.mockResolvedValue(updatedUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    })
  })

  describe('remove', () => {
    it('deve remover um user', async () => {
      const user = {id: 1, name: 'Teste', email: 'teste@teste.com' }
      mockRepository.findOneBy.mockResolvedValue(user)
      mockRepository.remove.mockResolvedValue(user)

      const result = await service.remove(1)
      expect(result).toEqual(user)
    })
  })
});

