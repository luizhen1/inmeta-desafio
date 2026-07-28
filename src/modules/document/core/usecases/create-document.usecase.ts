import { ConflictException, NotFoundException, Injectable } from '@nestjs/common';
import type { IDocumentRepository } from '../repositories/document.repository.interface';
import type { IEmployeeRepository } from '../../../employee/core/repositories/employee.repository.interface';
import type { IDocumentTypeRepository } from '../../../document-type/core/repositories/document-type.repository.interface';
import { Document } from '../entities/document.entity';
import { DocumentVersion } from '../entities/document-version.value-object';

export interface CreateDocumentInput {
  employeeId: string;
  documentTypeId: string;
  status?: string;
  sentBy: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly employeeRepository: IEmployeeRepository,
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(input: CreateDocumentInput): Promise<Document> {
    // 1. Valida se o colaborador existe e está ativo (deletedAt: null)
    const employee = await this.employeeRepository.findById(input.employeeId);
    if (!employee) {
      throw new NotFoundException(
        `Colaborador com ID ${input.employeeId} não existe ou foi removido.`,
      );
    }

    // 2. Valida se o tipo de documento existe e está ativo (deletedAt: null)
    const documentType = await this.documentTypeRepository.findById(
      input.documentTypeId,
    );
    if (!documentType) {
      throw new NotFoundException(
        `Tipo de documento com ID ${input.documentTypeId} não existe ou foi removido.`,
      );
    }

    // 3. Valida se o colaborador já possui esse documento cadastrado e ativo
    const existingDocument = await this.documentRepository.findByEmployeeAndType(
      input.employeeId,
      input.documentTypeId,
    );

    if (existingDocument) {
      throw new ConflictException(
        'Este colaborador já possui um documento ativo cadastrado para este tipo.',
      );
    }

    // 4. Cria a versão inicial e o registro do documento
    const initialVersion = new DocumentVersion(
      1,
      true,
      input.sentBy,
      input.metadata,
    );

    const document = new Document(
      input.employeeId,
      input.documentTypeId,
      input.status || 'PENDING',
      1,
      [initialVersion],
    );

    return this.documentRepository.create(document);
  }
}