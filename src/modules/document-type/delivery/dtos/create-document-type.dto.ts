import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentTypeDto {
  @ApiProperty({example: 'Comprovante de Residência', description: 'Nome do tipo de documento exigido',})
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name!: string;

  @ApiProperty({example: 'Conta de luz, água ou telefone emitida nos últimos 90 dias',
    description: 'Descrição detalhada sobre o documento exigido',
    required: false, // 👈 Define como opcional no Swagger
  })
  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsOptional()
  description?: string;
}