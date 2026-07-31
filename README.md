<h1 align="center">🏢 Inmeta - API de Gestão de Documentos</h1>

<p align="center">
  <i>Desafio Técnico: Sistema robusto para gestão de colaboradores, documentação (Upload/Download) com AWS S3 (LocalStack), Arquitetura Hexagonal e Observabilidade Avançada.</i>
</p>

---

## 🎯 Sobre o Projeto

Esta é uma API desenvolvida com **NestJS**, **TypeScript** e **MongoDB**, focada na gestão de colaboradores e seus respectivos documentos obrigatórios. 

O sistema implementa uma integração nativa de armazenamento em nuvem simulada localmente com **LocalStack (AWS S3)**, utilizando **URLs Pré-assinadas (Presigned URLs)** de Upload e Download para aliviar o servidor Node.js, além de possuir um rigoroso controle de versionamento, concorrência atômica, logs estruturados e rastreamento distribuído.

---

## 🏗️ Arquitetura e Padrões de Projeto

O projeto foi construído seguindo os princípios de **Clean Architecture / Arquitetura Hexagonal** e conceitos de **DDD (Domain-Driven Design)**, garantindo que as regras de negócio sejam isoladas e agnósticas a frameworks.

O fluxo de dados obedece a seguinte hierarquia estrita:
1. **Controllers (Adapters de Entrada):** Interceptam a requisição HTTP e validam o payload via DTOs.
2. **Use Cases (Core):** Contêm 100% da regra de negócio isolada (Single Responsibility Principle).
3. **Repositories & Providers (Adapters de Saída):** Implementam as interfaces do Core, traduzindo as entidades de domínio para o MongoDB (Mongoose) e AWS S3 SDK (LocalStack).

---

## 📐 System Design (Arquitetura)
<img width="1480" height="666" alt="image" src="https://github.com/user-attachments/assets/c39b0f9a-586b-44c1-8292-15343cde3001" />

## 🗄️ Modelagem de Dados (MongoDB)
A modelagem foi pensada de forma desnormalizada para otimizar a leitura (Embedded Documents no histórico de versões), utilizando índices compostos para garantir atomicidade e prevenir *Race Conditions*.
<img width="1261" height="835" alt="image" src="https://github.com/user-attachments/assets/cfc998d7-5514-49a9-ae65-7719ea7e98af" />

---

## 🌟 Destaques e Diferenciais (Stack Completa)

- ✅ **Upload e Download Cloud-Native (AWS S3 via LocalStack):**
  - Geração de *Presigned URLs* para upload direto do cliente para o bucket S3 sem sobrecarregar a API.
  - Geração de *Presigned URLs* de download para visualização segura dos arquivos armazenados.
- ✅ **Observabilidade Avançada & Tracing (Jaeger + Pino):**
  - **Pino Logger (`nestjs-pino`):** Logs estruturados em formato JSON de alta performance, com mascaramento automático de dados sensíveis.
  - **OpenTelemetry & Jaeger:** Rastreador distribuído (tracing) integrado para auditoria e análise de tempo de resposta de cada requisição.
- ✅ **Optimistic Locking (Concorrência Atômica):** Implementação de controle de versão no MongoDB (`$inc`) para evitar *Race Conditions* em atualizações simultâneas.
- ✅ **Versionamento de Documentos (Auditoria):** Envio de um novo arquivo inativa a versão anterior automaticamente, mantendo todo o histórico de alterações.
- ✅ **Dashboard Aggregations:** Uso avançado do *Aggregation Pipeline* do MongoDB para retornar estatísticas de completude e status do sistema.
- ✅ **Testes Automatizados (100% Coverage):** 
  - **Unitários:** 39 testes cobrindo todos os Casos de Uso com Mocks (`jest.fn()`).
  - **E2E (Integração):** Testes de integração validando rotas HTTP, conexão com MongoDB e geração de URLs do S3.
- ✅ **Dockerização Completa:** Containerização de toda a infraestrutura necessária (Database, Storage e Observabilidade).
- ✅ **Health Check:** Endpoint `/health` para monitoramento de saúde dos serviços.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** (v18 ou superior)
* **Docker** e **Docker Compose**

### 1. Clonar e Instalar Dependências
```bash
git clone git@github.com:luizhen1/inmeta-desafio.git
cd api
npm install
```

## 2. Subir a Infraestrutura (Docker)
```bash
docker-compose up -d
```

## 3. Executar a Aplicação (Modo de desenvolvimento)
```bash
npm run start:dev
```

## Ao iniciar, o terminal exibirá os links de acesso aos serviços:
- 🚀 Aplicação: http://localhost:3000
- 📚 Documentação Swagger: http://localhost:3000/api/docs
- 🔍 Jaeger Tracing UI: http://localhost:16686

## 💡 Como Testar o Fluxo de Arquivos (Upload / S3 / Download)
Você pode testar todo o fluxo de arquivos de forma simples utilizando o Swagger ou Postman:

- **Gerar URL de Upload**
  -Faça uma chamada POST /documents/upload-url enviando o nome do arquivo (fileName) e o tipo (contentType).
  - A API retornará uma url pré-assinada do S3.
- ✅ **Fazer o Upload (PUT)**
  - Crie uma requisição PUT no Postman/Insomnia colando a url gerada.
  - ⚠️ Dica de Teste: Se usar o Postman, vá na aba Params e desmarque os parâmetros x-amz-sdk-checksum-algorithm e x-amz-checksum-crc32.
  - Na aba Body, selecione a opção binary, escolha o arquivo físico (imagem/PDF) e clique em Send (Status 200 esperado).
- ✅ **Cadastrar o Documento:**
  - Faça um POST /documents informando o employeeId, documentTypeId e o nome do arquivo enviado (ex: fileName).
- ✅ **Visualizar/Baixar o Arquivo:**
  - Faça uma chamada GET /documents/{id}/download-url.
  - Copie a URL pré-assinada de retorno (downloadUrl), cole na barra de endereço do seu navegador e dê Enter.
  - O arquivo armazenado no S3 do LocalStack será aberto ou baixado imediatamente no seu navegador!

  ## 🧪 Como Rodar os Testes
  Testes Unitários (Casos de Uso em isolamento):
  ```bash
  npm run test
  ```

  Testes de Integração E2E (Integração NestJS + MongoDB + S3):
  ```bash
  npm run test:e2e
   ```
   
