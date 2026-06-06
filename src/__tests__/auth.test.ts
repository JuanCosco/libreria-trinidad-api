import request from 'supertest'
import app from '../app'
import prisma from '../utils/prisma'

const testUser = {
  nombre: 'Test',
  apellido: 'User',
  email: 'test@test.com',
  password: 'password123',
}

beforeEach(async () => {
  // Limpiar usuarios de test antes de cada test
  await prisma.user.deleteMany({ where: { email: testUser.email } })
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } })
})

describe('POST /api/auth/register', () => {
  it('debe registrar un usuario correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)

    expect(res.status).toBe(201)
    expect(res.body.user).toBeDefined()
    expect(res.body.user.email).toBe(testUser.email)
    expect(res.body.user.role).toBe('CLIENT')
    expect(res.body.user.passwordHash).toBeUndefined()
  })

  it('no debe registrar un email duplicado', async () => {
    await request(app).post('/api/auth/register').send(testUser)

    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Email ya registrado') 
  })

  it('debe rechazar registro sin campos requeridos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'incompleto@test.com' })

    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(testUser)
  })

  it('debe loguear con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe(testUser.email)
  })

  it('debe rechazar contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Credenciales inválidas')
  })

  it('debe rechazar email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: 'password123' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Credenciales inválidas')
  })
})