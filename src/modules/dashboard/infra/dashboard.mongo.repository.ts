import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDashboardRepository, DashboardStats } from '../core/repositories/dashboard.repository.interface';
import { EmployeeModel } from '../../employee/infra/employee.schema';
import { DocumentModel } from '../../document/infra/document.schema';
import { DocumentTypeModel } from '../../document-type/infra/document-type.schema';

@Injectable()
export class DashboardMongoRepository implements IDashboardRepository {
  constructor(
    @InjectModel(EmployeeModel.name) private readonly employeeModel: Model<EmployeeModel>,
    @InjectModel(DocumentModel.name) private readonly documentModel: Model<DocumentModel>,
    @InjectModel(DocumentTypeModel.name) private readonly documentTypeModel: Model<DocumentTypeModel>,
  ) { }

  async getStats(): Promise<DashboardStats> {
    const [completionPercentage, mostPending, latestUploads] = await Promise.all([
      this.calculateCompletionPercentage(),
      this.calculateMostPending(),
      this.getLatestUploads(),
    ]);

    return {
      completionPercentage,
      mostPendingDocumentTypes: mostPending,
      latestUploads,
    };
  }

  private async calculateCompletionPercentage(): Promise<number> {
    const employees = await this.employeeModel.find({ deletedAt: null }).lean().exec();

    let totalRequired = 0;
    for (const emp of employees) {
      const requiredTypes = (emp as any).requiredDocumentTypes || [];
      totalRequired += requiredTypes.length;
    }

    if (totalRequired === 0) return 100;

    const sentDocuments = await this.documentModel.countDocuments({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      status: { $in: ['SENT', 'APPROVED'] },
    }).exec();

    const percentage = (sentDocuments / totalRequired) * 100;
    return Math.min(Math.round(percentage * 100) / 100, 100);
  }

  private async calculateMostPending(): Promise<any[]> {
    const pendingDocs = await this.documentModel.aggregate([
      { $match: { status: 'PENDING' } }, // Filtra os pendentes
      { $group: { _id: '$documentTypeId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $addFields: { docTypeObjId: { $toObjectId: '$_id' } } },
      {
        $lookup: {
          from: 'document_types',
          localField: 'docTypeObjId',
          foreignField: '_id',
          as: 'typeInfo',
        },
      },
      { $unwind: { path: '$typeInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          documentTypeName: { $ifNull: ['$typeInfo.name', 'Tipo Desconhecido'] },
          pendingCount: '$count',
        },
      },
    ]);

    return pendingDocs;
  }

  private async getLatestUploads(): Promise<any[]> {
    const latest = await this.documentModel.aggregate([
      { $match: { status: { $in: ['SENT', 'APPROVED'] } } }, 
      { $sort: { updatedAt: -1 } },
      { $limit: 5 },
      {
        $addFields: {
          empObjId: { $toObjectId: '$employeeId' },
          docTypeObjId: { $toObjectId: '$documentTypeId' }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'empObjId',
          foreignField: '_id',
          as: 'employeeInfo',
        },
      },
      {
        $lookup: {
          from: 'document_types',
          localField: 'docTypeObjId',
          foreignField: '_id',
          as: 'typeInfo',
        },
      },
      { $unwind: { path: '$employeeInfo', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$typeInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          documentId: '$_id',
          employeeName: { $ifNull: ['$employeeInfo.name', 'Desconhecido'] },
          documentTypeName: { $ifNull: ['$typeInfo.name', 'Desconhecido'] },
          sentAt: '$updatedAt',
          status: '$status',
        },
      },
    ]);

    return latest;
  }
}