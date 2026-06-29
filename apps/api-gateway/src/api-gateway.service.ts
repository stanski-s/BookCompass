import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'API Gateway is working!';
  }

  async register(registerDto: any) {
    try {
      // 1. Create auth user
      const authResult = await lastValueFrom(this.authClient.send('auth.register', registerDto));
      // 2. Create user profile using the returned UUID
      const userResult = await lastValueFrom(
        this.userClient.send('user.createProfile', {
          id: authResult.id,
          username: registerDto.username || registerDto.email.split('@')[0],
          bio: '',
        }),
      );
      return { message: 'Registration successful', id: authResult.id, username: userResult.username };
    } catch (error: any) {
      throw new HttpException(error.message || 'Registration failed', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  login(loginDto: any) {
    return this.authClient.send('auth.login', loginDto);
  }

  getBooks() {
    return this.bookClient.send('book.findAll', {});
  }

  createBook(createBookDto: any) {
    return this.bookClient.send('book.create', createBookDto);
  }
}
