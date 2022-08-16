import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create({ email, password }: CreateUserDTO) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findByID(id: number) {
    if (!id) return null;
    return this.repo.findOne({
      where: { id },
    });
  }

  async listByEmail(email: string) {
    return this.repo.find({
      where: { email },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findByID(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async delete(id: number) {
    const user = await this.findByID(id);
    if (!user) throw new NotFoundException('User not found');
    return this.repo.remove(user);
  }
}
