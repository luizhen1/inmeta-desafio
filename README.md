<h1 align="center">🏢 Inmeta - API de Gestão de Documentos</h1>

<p align="center">
  <i>Desafio Técnico: Sistema robusto para gestão de colaboradores e documentação (Upload/Download) em nuvem simulada.</i>
</p>

## 🎯 Sobre o Projeto

Esta é uma API desenvolvida com **NestJS**, **TypeScript** e **MongoDB**, focada na gestão de colaboradores e seus respectivos documentos obrigatórios. 

O sistema simula um fluxo real de nuvem (Cloud Storage) utilizando **URLs Pré-assinadas (Presigned URLs)** para upload e download de arquivos, além de implementar um rigoroso controle de versionamento e tratamento de concorrência.

## 🏗️ Arquitetura e Padrões de Projeto

O projeto foi construído seguindo os princípios de **Clean Architecture** e conceitos de **DDD (Domain-Driven Design)**, garantindo que as regras de negócio sejam agnósticas a frameworks ou bancos de dados.

O fluxo de dados obedece a seguinte hierarquia estrita:
1. **Controllers (Delivery):** Interceptam a requisição HTTP e validam o payload via DTOs.
2. **Use Cases (Core):** Contêm 100% da regra de negócio isolada (Single Responsibility Principle).
3. **Repositories (Infra):** Implementam as interfaces do Core, traduzindo as entidades de domínio para esquemas do MongoDB (Mongoose).

## 📐 System Design (Arquitetura)
<img width="1738" height="731" alt="image" src="https://github.com/user-attachments/assets/bd24021f-78cf-4a75-853b-136f32f12949" />

## 🗄️ Modelagem de Dados (MongoDB)
A modelagem foi pensada de forma desnormalizada para otimizar a leitura (Embedded Documents no histórico de versões), utilizando índices compostos para garantir atomicidade e prevenir *Race Conditions*.
<img width="1261" height="835" alt="image" src="https://github.com/user-attachments/assets/cfc998d7-5514-49a9-ae65-7719ea7e98af" />

## 🌟 Destaques e Diferenciais (Bônus Entregues)

- ✅ **Upload e Download Cloud-Native:** Simulação de geração de *Presigned URLs* (AWS S3) para tirar a carga de transferência de arquivos do servidor Node.js.
- ✅ **Optimistic Locking (Concorrência):** Implementação de controle de versão atômico (`__v` e `$inc`) no MongoDB para evitar *Race Conditions* em atualizações simultâneas.
- ✅ **Versionamento de Documentos (Auditoria):** O envio de um mesmo tipo de documento para um funcionário inativa a versão anterior e cria uma nova.
- ✅ **Dashboard Aggregations:** Uso avançado de *Aggregation Pipeline* do MongoDB para retornar estatísticas de completude do sistema.
- ✅ **Testes Automatizados (100% Coverage):** 
  - **Unitários:** 39 testes cobrindo todos os Casos de Uso em isolamento usando Mocks (`jest.fn()`).
  - **E2E (Integração):** 5 testes validando as rotas de leitura e orquestração de nuvem diretamente com o banco de dados.
- ✅ **Dockerização:** Ambiente de banco de dados pronto para rodar com `docker-compose`.
- ✅ **Documentação Viva:** Swagger UI completo e interativo com o fluxo exato de Upload -> Criação -> Download.
- ✅ **Health Check:** Endpoint `/health` para monitoramento de disponibilidade da infraestrutura.

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** (v18 ou superior)
* **Docker** e **Docker Compose** (para o MongoDB)

### 1. Clonar e Instalar Dependências
```bash
git clone git@github.com:luizhen1/inmeta-desafio.git
cd api
npm install
```

### 2. Subir o Banco de Dados (Docker)
Um arquivo `docker-compose.yml` está incluso na raiz para subir uma instância local do MongoDB:
```bash
docker-compose up -d
```

### 3. Executar a Aplicação
```bash
# Modo de desenvolvimento
npm run start:dev
```
A API estará rodando em: `http://localhost:3000`

## 📖 Documentação (Swagger)

Com a aplicação rodando, acesse a documentação interativa pelo link abaixo para testar as rotas:

👉 **[Acessar Swagger UI](http://localhost:3000/api)**

*Dica: Teste o fluxo completo de documentos na ordem apresentada no Swagger (Gerar Upload URL -> Criar Documento -> Gerar Download URL).*

## 🧪 Como Rodar os Testes

**Testes Unitários (Regras de Negócio isoladas com Mocks):**
```bash
npm run test
```

**Testes de Integração E2E (Integração NestJS + MongoDB):**
```bash
npm run test:e2e
```
*(Nota: Os testes E2E focam intencionalmente em rotas seguras e de simulação para validar a infraestrutura sem inserir "sujeira" na base de dados de desenvolvimento).*
