import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDTO } from './dtos/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup({ email, password }: CreateUserDTO) {
    const users = await this.userService.listByEmail(email);
    if (users.length) throw new ConflictException('Email already in use');
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return this.userService.create({ email, password: result });
  }

  async signin({ email, password }: CreateUserDTO) {
    const [user] = await this.userService.listByEmail(email);
    if (!user) throw new BadRequestException('User or password incorrect');
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('User or password incorrect');
    return user;
  }
}
