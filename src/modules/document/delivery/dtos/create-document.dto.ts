import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ 
    example: '6a6bfb9a25097dc9d3e533ab',
    description: 'ID do colaborador'
  })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ 
    example: '6a6bfbd025097dc9d3e533ac',
    description: 'ID do tipo de documento'
  })
  @IsString()
  @IsNotEmpty()
  documentTypeId: string;

  @ApiProperty({ 
    example: 'SENT',
    description: 'Status do documento'
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ 
    example: 'luiz.lime@inmeta.com.br',
    description: 'E-mail ou identificação de quem enviou'
  })
  @IsString()
  @IsNotEmpty()
  sentBy: string;

  @ApiProperty({
    example: {
      fileKey: 'casamento.png',
      fileSize: '117KB'
    },
    description: 'Metadados adicionais, incluindo a chave do arquivo no S3'
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}