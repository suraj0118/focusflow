import request from 'supertest'
import { app } from '../src/app.js'

test('Tasks API enforces auth guard and CRUD operations', async () => {
  const guestResponse = await request(app).get('/tasks')
  expect(guestResponse.status).toBe(401)

  const registerResponse = await request(app)
    .post('/auth/register')
    .send({ email: 'tasks@example.com', password: 'secret' })

  const token = registerResponse.body.token
  const createResponse = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test Task' })

  expect(createResponse.status).toBe(201)
  expect(createResponse.body.title).toBe('Test Task')

  const listResponse = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${token}`)

  expect(listResponse.status).toBe(200)
  expect(Array.isArray(listResponse.body)).toBe(true)
  expect(listResponse.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: createResponse.body.id, title: 'Test Task' })
    ])
  )

  const updateResponse = await request(app)
    .put(`/tasks/${createResponse.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Updated Task' })

  expect(updateResponse.status).toBe(200)
  expect(updateResponse.body.title).toBe('Updated Task')

  const deleteResponse = await request(app)
    .delete(`/tasks/${createResponse.body.id}`)
    .set('Authorization', `Bearer ${token}`)

  expect(deleteResponse.status).toBe(204)
})
