import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeController } from './delivery/employee.controller';
import { CreateEmployeeUseCase } from './core/usecases/create-employee.usecase';
import { EmployeeMongoRepository } from './infra/employee.mongo.repository';
import { EmployeeModel, EmployeeSchema } from './infra/employee.schema';
import { EMPLOYEE_REPOSITORY } from './core/repositories/employee.repository.interface';
import { ListEmployeesUseCase } from './core/usecases/list-employees.usecase';
import { GetEmployeeByIdUseCase } from './core/usecases/get-employee-by-id.usecase';
import { UpdateEmployeeUseCase } from './core/usecases/update-employee.usecase';
import { DeleteEmployeeUseCase } from './core/usecases/delete-employee.usecase';

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
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
    {
      provide: EMPLOYEE_REPOSITORY,
      useClass: EmployeeMongoRepository,
    },
  ],
})
export class EmployeeModule {}