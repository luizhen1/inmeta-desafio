import { Controller, Post, Get, Put, Delete,Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmployeeUseCase } from '../core/usecases/create-employee.usecase';
import { ListEmployeesUseCase } from '../core/usecases/list-employees.usecase';
import { GetEmployeeByIdUseCase } from '../core/usecases/get-employee-by-id.usecase';
import { UpdateEmployeeUseCase } from '../core/usecases/update-employee.usecase';
import { DeleteEmployeeUseCase } from '../core/usecases/delete-employee.usecase';
import { CreateEmployeeDto } from './employee.dto';
import { UpdateEmployeeDto } from './update-employee.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly listEmployeesUseCase: ListEmployeesUseCase,
    private readonly getEmployeeByIdUseCase: GetEmployeeByIdUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
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

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um colaborador' })
  @ApiResponse({ status: 200, description: 'Colaborador atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Colaborador não encontrado.' })
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.updateEmployeeUseCase.execute(id, updateEmployeeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza campos específicos de um colaborador' })
  @ApiResponse({ status: 200, description: 'Colaborador atualizado parcialmente com sucesso.' })
  @ApiResponse({ status: 404, description: 'Colaborador não encontrado.' })
  async patchUpdate(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.updateEmployeeUseCase.execute(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um colaborador pelo ID' })
  @ApiResponse({ status: 200, description: 'Colaborador removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Colaborador não encontrado.' })
  async remove(@Param('id') id: string) {
    return this.deleteEmployeeUseCase.execute(id);
  }
}