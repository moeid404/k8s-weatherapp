const request = require('supertest');

// نعمل Mock للـweatherClient عشان الاختبارات تبقى ثابتة
jest.mock('../../src/lib/weatherClient', () => ({
  getWeatherByCity: async (city) => ({ city, tempC: 18, source: 'test-mock' })
}));

const app = require('../../src/server');

describe('integration', () => {
  let token;
  beforeAll(async () => {
    await request(app).post('/auth/signup').send({ email: 'x@y.com', password: 'pw' });
    const res = await request(app).post('/auth/signin').send({ email: 'x@y.com', password: 'pw' });
    token = res.body.token;
  });

  test('healthz ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('weather requires auth', async () => {
    const res = await request(app).get('/weather?city=Cairo');
    expect(res.status).toBe(401);
  });

  test('weather returns data when authed', async () => {
    const res = await request(app).get('/weather?city=Cairo').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.city).toBe('Cairo');
    expect(res.body.source).toBe('test-mock');
  });
});
