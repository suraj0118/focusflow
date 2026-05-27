import request from 'supertest'
import { app } from '../src/app.js'

describe('Auth API tests', () => {
  test('registers a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'secret' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('token')
    expect(response.body.email).toBe('test@example.com')
  })

  test('logs in an existing user', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'login@example.com', password: 'secret' })

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'login@example.com', password: 'secret' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  test('refreshes auth tokens', async () => {
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({ email: 'refresh@example.com', password: 'secret' })

    const response = await request(app)
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body.token).not.toBe(registerResponse.body.token)
  })

  test('logs out a user', async () => {
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({ email: 'logout@example.com', password: 'secret' })

    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)

    expect(response.status).toBe(204)
  })
})
