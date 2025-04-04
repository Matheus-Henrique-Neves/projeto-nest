import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AbstractHttpAdapter } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
@Module({
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
