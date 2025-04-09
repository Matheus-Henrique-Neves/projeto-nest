import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrytpt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getRepositoryToken(User),
        useValue: mockRepository
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('FindAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, email: "teste@teste.com", name: "teste", password: "123456" },
        { id: 2, email: "teste2@teste.com", name: "teste2", password: "1234567" }
      ]
      mockRepository.find.mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toEqual(users);
    })
  });
  describe('FindOne', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: "teste@teste.com", name: "teste", password: "123456" }
      mockRepository.findOneBy.mockResolvedValue(user);
      const result = await service.findOneByEmail(user.email);
      expect(result).toEqual(user);
    
    });
  describe('Create', () => {
    it('should create a user', async () => {
      const createUserDTO:CreateUserDto= { email: "teste@teste.com", name: "teste", password: "123456" }
      const hashPassword="senhahash"
      jest.spyOn(bcrytpt, 'hash').mockResolvedValue(hashPassword);
      const user = { id: 1, ...createUserDTO, password: hashPassword }
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);
      const result = await service.create(createUserDTO);
      expect(result).toEqual(user);



    })
  });





});
