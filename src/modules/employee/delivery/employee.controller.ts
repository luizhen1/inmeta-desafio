import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmployeeUseCase } from '../core/create-employee.usecase';
import { ListEmployeesUseCase } from '../core/list-employees.usecase';
import { GetEmployeeByIdUseCase } from '../core/get-employee-by-id.usecase';
import { CreateEmployeeDto } from './employee.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly listEmployeesUseCase: ListEmployeesUseCase,
    private readonly getEmployeeByIdUseCase: GetEmployeeByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo colaborador' })
  @ApiResponse({ status: 201, description: 'Colaborador criado com sucesso.' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.createEmployeeUseCase.execute(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os colaboradores' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll() {
    return this.listEmployeesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um colaborador pelo ID' })
  @ApiResponse({ status: 200, description: 'Colaborador encontrado.' })
  @ApiResponse({ status: 404, description: 'Colaborador não encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.getEmployeeByIdUseCase.execute(id);
  }
}