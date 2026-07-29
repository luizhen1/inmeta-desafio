import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do colaborador',
  })
  @IsString({ message: 'O nome deve ser uma string válida.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name!: string;

  @ApiProperty({
    example: 'joao.silva@inmeta.com.br',
    description: 'E-mail corporativo',
  })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @ApiProperty({
    example: '12345678900',
    description: 'CPF apenas com números',
  })
  @IsString({ message: 'O CPF deve ser uma string.' })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  cpf!: string;

  @ApiPropertyOptional({
    example: 'Desenvolvedor Backend',
    description: 'Cargo do colaborador',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    example: 'Tecnologia',
    description: 'Departamento do colaborador',
  })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({
    example: ['COLE_AQUI_O_ID_DO_RG', 'COLE_AQUI_O_ID_DO_COMPROVANTE'],
    description: 'Lista de IDs dos tipos de documentos exigidos',
    type: [String],
  })
  @IsArray({ message: 'requiredDocumentTypes deve ser um array.' })
  @IsMongoId({ each: true, message: 'Cada item deve ser um ID válido do MongoDB.' })
  @IsOptional()
  requiredDocumentTypes?: string[];
}