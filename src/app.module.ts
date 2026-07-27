import { Module } from '@nestjs/common';
import { EmployeeModule } from './modules/employee/employee.module';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/inmetadb'),
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
