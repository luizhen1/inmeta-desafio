import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './delivery/dashboard.controller';
import { GetDashboardStatsUseCase } from './core/usecases/get-dashboard-stats.usecase';
import { DashboardMongoRepository } from './infra/dashboard.mongo.repository';
import { EmployeeModel, EmployeeSchema } from '../employee/infra/employee.schema';
import { DocumentModel, DocumentSchema } from '../document/infra/document.schema';
import { DocumentTypeModel, DocumentTypeSchema } from '../document-type/infra/document-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeModel.name, schema: EmployeeSchema },
      { name: DocumentModel.name, schema: DocumentSchema },
      { name: DocumentTypeModel.name, schema: DocumentTypeSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: 'IDashboardRepository',
      useClass: DashboardMongoRepository,
    },
    GetDashboardStatsUseCase,
  ],
})
export class DashboardModule {}