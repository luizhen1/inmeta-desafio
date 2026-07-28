import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    example: '66a6811718a6c27ba9ca0f90',
    description: 'ID do colaborador (Employee)',
  })
  @IsMongoId({ message: 'O employeeId deve ser um ObjectId do MongoDB válido.' })
  @IsNotEmpty({ message: 'O employeeId é obrigatório.' })
  employeeId!: string;

  @ApiProperty({
    example: '66a6811718a6c27ba9ca0f93',
    description: 'ID do tipo de documento (DocumentType)',
  })
  @IsMongoId({ message: 'O documentTypeId deve ser um ObjectId do MongoDB válido.' })
  @IsNotEmpty({ message: 'O documentTypeId é obrigatório.' })
  documentTypeId!: string;

  @ApiProperty({
    example: 'PENDING',
    description: 'Status do documento (ex: PENDING, APPROVED, REJECTED)',
    default: 'PENDING',
  })
  @IsString({ message: 'O status deve ser uma string.' })
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 'joao.silva@inmeta.com.br',
    description: 'Identificador/E-mail de quem enviou o documento',
  })
  @IsString({ message: 'O campo sentBy deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo sentBy é obrigatório.' })
  sentBy!: string;

  @ApiProperty({
    example: { url: 'https://storage.inmeta.com/docs/rg.pdf', fileSize: '2MB' },
    description: 'Metadados flexíveis da versão do documento',
    required: false,
  })
  @IsObject({ message: 'O metadata deve ser um objeto.' })
  @IsOptional()
  metadata?: Record<string, any>;
}