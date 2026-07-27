import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeController } from './delivery/employee.controller';
import { CreateEmployeeUseCase } from './core/create-employee.usecase';
import { EmployeeMongoRepository } from './infra/employee.mongo.repository';
import { EmployeeModel, EmployeeSchema } from './infra/employee.schema';
import { EMPLOYEE_REPOSITORY } from './core/employee.repository.interface';
import { ListEmployeesUseCase } from './core/list-employees.usecase';
import { GetEmployeeByIdUseCase } from './core/get-employee-by-id.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeModel.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [
    CreateEmployeeUseCase,
    ListEmployeesUseCase,
    GetEmployeeByIdUseCase,
    {
      provide: EMPLOYEE_REPOSITORY,
      useClass: EmployeeMongoRepository,
    },
  ],
})
export class EmployeeModule {}