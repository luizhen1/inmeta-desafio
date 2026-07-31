// Define o nome do serviço via variável de ambiente (Padrão OTel)
process.env.OTEL_SERVICE_NAME = 'inmeta-api';

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const exporter = new OTLPTraceExporter({
  // Porta 4318 liberada no docker-compose para o Jaeger
  url: 'http://localhost:4318/v1/traces', 
});

export const otelSDK = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Evita poluir o Jaeger com logs internos do Node e arquivos estáticos
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-express': { enabled: true },
    }),
  ],
});

// Inicializa o tracing
otelSDK.start();

process.on('SIGTERM', () => {
  otelSDK.shutdown().then(
    () => console.log('OpenTelemetry desligado com sucesso.'),
    (err) => console.error('Erro ao desligar OpenTelemetry', err),
  );
});