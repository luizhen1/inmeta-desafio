import { Inject, Injectable } from '@nestjs/common';
import { IDashboardRepository, DashboardStats } from '../repositories/dashboard.repository.interface';

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject('IDashboardRepository')
    private readonly dashboardRepository: IDashboardRepository,
  ) {}

  async execute(): Promise<DashboardStats> {
    return this.dashboardRepository.getStats();
  }
}