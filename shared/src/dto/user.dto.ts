import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsISO8601,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({ example: 'dummy@yopmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'dummy user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Test111@' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '1990-12-12', required: false })
  @IsISO8601()
  @IsOptional()
  dob: string;

  @ApiProperty({ example: 'dummy address', required: false })
  @IsString()
  @IsOptional()
  address: string;

}
export class SignInRequestDto {
  @ApiProperty({ example: 'dummy@yopmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Test111@' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class UpdateProfileRequestDto {
  @ApiProperty({ example: 'test user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '1990-12-12', required: false })
  @IsISO8601()
  @IsOptional()
  dob?: string;

  @ApiProperty({ example: 'dummy Address', required: false })
  @IsString()
  @IsOptional()
  address?: string;
  @ApiProperty({
    example: 'https://picsum.photos/200/300',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  profileURL?: string;

  @ApiProperty({
    description: 'categories Ids',
    default: [],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  categories?: string[];

  id?: string;
  password?: string;
}

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'Test111@' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
  
  @ApiProperty({ example: 'Test123@' })
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;

  userId?: string;
}
