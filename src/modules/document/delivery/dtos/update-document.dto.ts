import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @ApiProperty({
    example: 'APPROVED',
    description: 'Novo status do documento (ex: APPROVED, REJECTED, PENDING)',
    required: false,
  })
  @IsString({ message: 'O status deve ser uma string.' })
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 'admin@inmeta.com.br',
    description: 'Identificador de quem enviou a nova versão',
    required: false,
  })
  @IsString({ message: 'O campo sentBy deve ser uma string.' })
  @IsOptional()
  sentBy?: string;

  @ApiProperty({
    example: { url: 'https://storage.inmeta.com/docs/rg_v2.pdf', fileSize: '2.5MB' },
    description: 'Novos metadados para gerar uma nova versão do documento',
    required: false,
  })
  @IsObject({ message: 'O metadata deve ser um objeto.' })
  @IsOptional()
  metadata?: Record<string, any>;
}