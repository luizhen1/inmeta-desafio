import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'João da Silva', description: 'Nome completo do colaborador' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '12345678900', description: 'CPF contendo apenas números' })
  @IsString()
  @IsNotEmpty()
  cpf!: string;

  @ApiProperty({ example: 'joao.silva@inmeta.com.br' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}