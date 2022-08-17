import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserDTO } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/whoami')
  async whoAmI(@CurrentUser() user: string) {
    return user;
  }

  @Get('/:id')
  async findOneUser(@Param('id') id: string) {
    const user = await this.userService.findByID(parseInt(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get()
  async findUsersByEmail(@Query('email') email: string) {
    return this.userService.listByEmail(email);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(parseInt(id));
  }
}
