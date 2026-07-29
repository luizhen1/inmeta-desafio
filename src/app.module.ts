import { Module } from '@nestjs/common';
import { EmployeeModule } from './modules/employee/employee.module';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { DocumentModule } from './modules/document/document.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/inmetadb'),
    EmployeeModule,
    DocumentTypeModule,
    DocumentModule,
    DashboardModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [],
})
export class AppModule { }
