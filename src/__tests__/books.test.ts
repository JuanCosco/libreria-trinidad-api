import request from 'supertest'
import app from '../app'
import prisma from '../utils/prisma'

let adminToken: string
let clientToken: string
let categoryId: string
let bookId: string

beforeAll(async () => {
  // Limpiar
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.book.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany({ where: { email: { in: ['admin@test.com', 'client@test.com'] } } })

  // Crear admin
  await request(app).post('/api/auth/register').send({
    nombre: 'Admin', apellido: 'Test', email: 'admin@test.com', password: 'password123'
  })
  await prisma.user.update({ where: { email: 'admin@test.com' }, data: { role: 'ADMIN' } })
  const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'password123' })
  adminToken = adminRes.body.token

  // Crear client
  await request(app).post('/api/auth/register').send({
    nombre: 'Client', apellido: 'Test', email: 'client@test.com', password: 'password123'
  })
  const clientRes = await request(app).post('/api/auth/login').send({ email: 'client@test.com', password: 'password123' })
  clientToken = clientRes.body.token

  // Crear categoría
  const catRes = await request(app)
    .post('/api/categories')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ nombre: 'Test Categoría' })
  categoryId = catRes.body.category.id
})

afterAll(async () => {
  await prisma.book.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany({ where: { email: { in: ['admin@test.com', 'client@test.com'] } } })
})

describe('GET /api/books', () => {
  it('debe retornar lista de libros sin autenticación', async () => {
    const res = await request(app).get('/api/books')
    expect(res.status).toBe(200)
    expect(res.body.books).toBeDefined()
    expect(Array.isArray(res.body.books)).toBe(true)
  })
})

describe('POST /api/books', () => {
  it('admin debe poder crear un libro', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Libro Test',
        descripcion: 'Descripción test',
        precio: 29.99,
        descuento: 0,
        categoryId,
      })

    expect(res.status).toBe(201)
    expect(res.body.book.nombre).toBe('Libro Test')
    bookId = res.body.book.id
  })

  it('cliente no debe poder crear un libro', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        nombre: 'Libro No Autorizado',
        descripcion: 'Test',
        precio: 10,
        descuento: 0,
        categoryId,
      })

    expect(res.status).toBe(403)
  })

  it('no autenticado no debe poder crear un libro', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({
        nombre: 'Libro Sin Auth',
        descripcion: 'Test',
        precio: 10,
        descuento: 0,
        categoryId,
      })

    expect(res.status).toBe(401)
  })
})

describe('GET /api/books/:id', () => {
  it('debe retornar un libro por id', async () => {
    const res = await request(app).get(`/api/books/${bookId}`)
    expect(res.status).toBe(200)
    expect(res.body.book.id).toBe(bookId)
  })

  it('debe retornar 404 para id inexistente', async () => {
    const res = await request(app).get('/api/books/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/books/:id', () => {
  it('admin debe poder actualizar un libro', async () => {
    const res = await request(app)
      .patch(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ precio: 39.99 })

    expect(res.status).toBe(200)
    expect(Number(res.body.book.precio)).toBe(39.99)
  })
})

describe('DELETE /api/books/:id', () => {
  it('admin debe poder desactivar un libro', async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBeDefined()
  })
})