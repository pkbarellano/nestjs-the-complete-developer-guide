import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'test@email.com', password: '1234' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email: 'test@email.com', password: '1234' } as User])
      },
      // remove: () => { },
      // update: () => { }
    };

    fakeAuthService = {
      // signup: () => { },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers return a list or users with given email', async () => {
    const users = await controller.findAllUsers('test@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@email.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(
      controller.findUser('1')
    ).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and return user', async () => {
    const session = { userId: 2 };
    const user = await controller.signin({ email: 'test@email.com', password: '1234' }, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
