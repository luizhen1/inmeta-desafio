import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModel, EmployeeSchema } from './infra/employee.schema';
import { EmployeeMongoRepository } from './infra/employee.mongo.repository';
import { CreateEmployeeUseCase } from './core/usecases/create-employee.usecase';
import { ListEmployeesUseCase } from './core/usecases/list-employees.usecase';
import { GetEmployeeByIdUseCase } from './core/usecases/get-employee-by-id.usecase';
import { UpdateEmployeeUseCase } from './core/usecases/update-employee.usecase';
import { DeleteEmployeeUseCase } from './core/usecases/delete-employee.usecase';
import { EmployeeController } from './delivery/employee.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeModel.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [
    {
      provide: 'IEmployeeRepository', // 👈 Token idêntico ao export
      useClass: EmployeeMongoRepository,
    },
    {
      provide: CreateEmployeeUseCase,
      useFactory: (repo) => new CreateEmployeeUseCase(repo),
      inject: ['IEmployeeRepository'],
    },
    {
      provide: ListEmployeesUseCase,
      useFactory: (repo) => new ListEmployeesUseCase(repo),
      inject: ['IEmployeeRepository'],
    },
    {
      provide: GetEmployeeByIdUseCase,
      useFactory: (repo) => new GetEmployeeByIdUseCase(repo),
      inject: ['IEmployeeRepository'],
    },
    {
      provide: UpdateEmployeeUseCase,
      useFactory: (repo) => new UpdateEmployeeUseCase(repo),
      inject: ['IEmployeeRepository'],
    },
    {
      provide: DeleteEmployeeUseCase,
      useFactory: (repo) => new DeleteEmployeeUseCase(repo),
      inject: ['IEmployeeRepository'],
    },
  ],
  exports: ['IEmployeeRepository'],
})
export class EmployeeModule {}