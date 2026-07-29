import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verifica o status e a disponibilidade da API' })
  @ApiResponse({ status: 200, description: 'API está online e funcionando.' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'API de Gerenciamento de Documentos operando normalmente.',
    };
  }
}