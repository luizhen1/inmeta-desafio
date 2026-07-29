import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Testes de Integração da API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health - deve retornar que a infraestrutura da API está online (Status 200)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('ok');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('uptime');
      });
  });

  it('GET /employees - deve cruzar todas as camadas até o MongoDB e retornar uma lista (Status 200)', () => {
    return request(app.getHttpServer())
      .get('/employees')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
      });
  });

  it('GET /employees/:id - deve retornar 404 Not Found para IDs que não existem', () => {
    const validMongoIdButFake = '507f1f77bcf86cd799439011'; 
    
    return request(app.getHttpServer())
      .get(`/employees/${validMongoIdButFake}`)
      .expect(404);
  });
});
