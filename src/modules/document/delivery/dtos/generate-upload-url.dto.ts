import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';

export class GenerateUploadUrlDto {
  @ApiProperty({
    example: 'rg_frente_verso.pdf',
    description: 'Nome original do arquivo a ser enviado',
  })
  @IsString({ message: 'O fileName deve ser uma string.' })
  @IsNotEmpty({ message: 'O fileName é obrigatório.' })
  fileName!: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'Tipo MIME do arquivo (ex: application/pdf, image/png)',
  })
  @IsString({ message: 'O mimeType deve ser uma string.' })
  @IsNotEmpty({ message: 'O mimeType é obrigatório.' })
  mimeType!: string;

  @ApiProperty({
    example: 1572864,
    description: 'Tamanho do arquivo em bytes (máximo 10 MB)',
  })
  @IsNumber({}, { message: 'O fileSizeInBytes deve ser um número.' })
  @Max(10 * 1024 * 1024, { message: 'O tamanho máximo do arquivo permitido é 10 MB.' })
  @IsNotEmpty({ message: 'O fileSizeInBytes é obrigatório.' })
  fileSizeInBytes!: number;
}