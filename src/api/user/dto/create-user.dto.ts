import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['admin', 'user'])
  @IsNotEmpty()
  role: string;
}
