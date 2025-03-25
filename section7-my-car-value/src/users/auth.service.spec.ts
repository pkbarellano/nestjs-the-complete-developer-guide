import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);

                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('email12@email.com', 'password12');

        expect(user.password).not.toEqual('password12');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signup with existing email', async () => {
        await service.signup('email13@email.com', 'password13');

        await expect(
            service.signup('email13@email.com', 'password13')
        ).rejects.toThrow(BadRequestException);
    });

    it('throws if signin is called within an unused email', async () => {

        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'email11@email.com', password: 'password11' } as User]);

        await expect(
            service.signin('email11@email.com', 'password11')
        ).rejects.toThrow(BadRequestException);
    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('email15@email.com', 'password15');

        await expect(
            service.signin('email15@email.com', '1234')
        ).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup('email17@email.com', 'password17');

        const user = await service.signin('email17@email.com', 'password17');
        expect(user).toBeDefined();
    });
});