import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findByID(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findByID(id);
    if (!user) throw new Error('User not found');
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
}
