import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetDashboardStatsUseCase } from '../core/usecases/get-dashboard-stats.usecase';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase) {}

  @Get('stats')
  @ApiOperation({ summary: 'Retorna estatísticas gerais do sistema' })
  @ApiResponse({ status: 200, description: 'Estatísticas geradas com sucesso.' })
  async getStats() {
    return this.getDashboardStatsUseCase.execute();
  }
}