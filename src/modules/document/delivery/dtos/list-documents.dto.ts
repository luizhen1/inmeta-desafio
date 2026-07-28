import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsOptional, IsString, Min } from 'class-validator';

export class ListDocumentsDto {
  @ApiPropertyOptional({ description: 'Página atual', example: 1, default: 1 })
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro.' })
  @Min(1, { message: 'A página mínima é 1.' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Quantidade de itens por página', example: 10, default: 10 })
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro.' })
  @Min(1, { message: 'O limite mínimo é 1.' })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filtrar pelo ID do colaborador' })
  @IsMongoId({ message: 'O employeeId deve ser um ObjectId válido.' })
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Filtrar pelo ID do tipo de documento' })
  @IsMongoId({ message: 'O documentTypeId deve ser um ObjectId válido.' })
  @IsOptional()
  documentTypeId?: string;

  @ApiPropertyOptional({ description: 'Filtrar pelo status (ex: PENDING, SENT, APPROVED, REJECTED)' })
  @IsString({ message: 'O status deve ser uma string.' })
  @IsOptional()
  status?: string;
}