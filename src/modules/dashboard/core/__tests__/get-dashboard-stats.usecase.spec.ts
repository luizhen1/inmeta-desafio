import { GetDashboardStatsUseCase } from '../usecases/get-dashboard-stats.usecase';
import { IDashboardRepository, DashboardStats } from '../repositories/dashboard.repository.interface';

describe('GetDashboardStatsUseCase', () => {
  let useCase: GetDashboardStatsUseCase;
  let mockRepository: jest.Mocked<IDashboardRepository>;

  beforeEach(() => {
    mockRepository = {
      getStats: jest.fn(),
    };

    useCase = new GetDashboardStatsUseCase(mockRepository);
  });

  it('deve retornar as estatísticas do dashboard com sucesso', async () => {
    const mockStats: DashboardStats = {
      completionPercentage: 85.5,
      mostPendingDocumentTypes: [
        {
          documentTypeName: 'RG',
          pendingCount: 12,
        },
        {
          documentTypeName: 'Comprovante de Residência',
          pendingCount: 8,
        },
      ],
      latestUploads: [
        {
          documentId: '64c1234567890',
          employeeName: 'João da Silva',
          documentTypeName: 'CPF',
          sentAt: new Date(),
          status: 'SENT',
        },
      ],
    };

    mockRepository.getStats.mockResolvedValue(mockStats);

    const result = await useCase.execute();
    expect(mockRepository.getStats).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockStats);
    expect(result.completionPercentage).toBe(85.5);
    expect(result.mostPendingDocumentTypes).toHaveLength(2);
    expect(result.latestUploads[0].employeeName).toBe('João da Silva');
  });
});