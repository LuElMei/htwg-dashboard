import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { app, seedDatabase } from './app';

beforeAll(async () => {
  await seedDatabase();
});

describe('Authentifizierung und JWT', () => {
  it('lehnt unvollstaendige Registrierung ab', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'ab', email: 'ungueltig', password: 'kurz' });

    expect(response.status).toBe(400);
  });

  it('lehnt einen falschen Login ab', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'falsch123' });

    expect(response.status).toBe(401);
  });

  it('gibt beim korrekten Login einen JWT aus', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'test1234' });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('schuetzt /api/auth/me ohne Token', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
  });

  it('liefert den User mit gueltigem Bearer-Token', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'test1234' });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe('testuser');
  });
});
