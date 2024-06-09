import { Role } from '@prisma/client';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  full_name: string;

  @IsPhoneNumber('RU', { message: 'Введите номер телефона' })
  phone: string;

  @IsString()
  username: string;

  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;

  @IsString()
  role: Role;
}
