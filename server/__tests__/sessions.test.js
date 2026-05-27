import request from 'supertest'
import { app } from '../src/app.js'

describe('Sessions API tests', () => {
  test('saves a session and returns analytics', async () => {
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({ email: 'sessions@example.com', password: 'secret' })

    const token = registerResponse.body.token
    const sessionResponse = await request(app)
      .post('/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send({ duration: 25, notes: 'Focus work' })

    expect(sessionResponse.status).toBe(201)
    expect(sessionResponse.body).toHaveProperty('id')
    expect(sessionResponse.body.duration).toBe(25)

    const analyticsResponse = await request(app)
      .get('/sessions/analytics')
      .set('Authorization', `Bearer ${token}`)

    expect(analyticsResponse.status).toBe(200)
    expect(analyticsResponse.body).toHaveProperty('count')
    expect(typeof analyticsResponse.body.count).toBe('number')
  })
})
