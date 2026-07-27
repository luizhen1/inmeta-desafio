import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmployeeUseCase } from '../core/create-employee.usecase';
import { CreateEmployeeDto } from './employee.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo colaborador' })
  @ApiResponse({ status: 201, description: 'Colaborador criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.createEmployeeUseCase.execute(createEmployeeDto);
  }
}