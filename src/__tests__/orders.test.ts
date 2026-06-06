import request from 'supertest'
import app from '../app'
import prisma from '../utils/prisma'

let adminToken: string
let clientToken: string
let bookId: string
let categoryId: string
let orderId: string

beforeAll(async () => {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.book.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany({ where: { email: { in: ['order-admin@test.com', 'order-client@test.com'] } } })

    // Crear admin
    await request(app).post('/api/auth/register').send({
        nombre: 'Admin', apellido: 'Order', email: 'order-admin@test.com', password: 'password123'
    })
    await prisma.user.update({ where: { email: 'order-admin@test.com' }, data: { role: 'ADMIN' } })
    const adminRes = await request(app).post('/api/auth/login').send({ email: 'order-admin@test.com', password: 'password123' })
    adminToken = adminRes.body.token

    // Crear client
    await request(app).post('/api/auth/register').send({
        nombre: 'Client', apellido: 'Order', email: 'order-client@test.com', password: 'password123'
    })
    const clientRes = await request(app).post('/api/auth/login').send({ email: 'order-client@test.com', password: 'password123' })
    clientToken = clientRes.body.token

    // Crear categoría y libro
    const catRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Order Test Cat' })
    categoryId = catRes.body.category.id

    const bookRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Libro Order', descripcion: 'Test', precio: 49.99, descuento: 10, categoryId })
    bookId = bookRes.body.book.id

    // Agregar libro al carrito del client
    await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ bookId, cantidad: 2 })
})

afterAll(async () => {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.book.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany({ where: { email: { in: ['order-admin@test.com', 'order-client@test.com'] } } })
})

describe('POST /api/orders', () => {
    it('debe crear una orden desde el carrito', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(res.status).toBe(201)
        expect(res.body.order).toBeDefined()
        expect(res.body.order.items).toHaveLength(1)
        expect(res.body.order.status).toBe('PENDING')
        orderId = res.body.order.id
    })

    it('debe vaciar el carrito tras crear la orden', async () => {
        const cartRes = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(cartRes.body.cart.items).toHaveLength(0)
    })

    it('no debe crear orden con carrito vacío', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(res.status).toBe(400)
    })

    it('debe rechazar sin autenticación', async () => {
        const res = await request(app).post('/api/orders')
        expect(res.status).toBe(401)
    })
})

describe('GET /api/orders/my', () => {
    it('debe retornar las órdenes del cliente', async () => {
        const res = await request(app)
            .get('/api/orders/my')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(res.status).toBe(200)
        expect(res.body.orders).toHaveLength(1)
    })
})

describe('GET /api/orders/:id', () => {
    it('cliente debe poder ver su propia orden', async () => {
        const res = await request(app)
            .get(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${clientToken}`)

        expect(res.status).toBe(200)
        expect(res.body.order.id).toBe(orderId)
    })
})

describe('GET /api/orders', () => {
    it('admin debe ver todas las órdenes', async () => {
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${adminToken}`)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body.orders)).toBe(true)
    })

    it('cliente no debe ver todas las órdenes', async () => {
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(res.status).toBe(403)
    })
})

describe('PATCH /api/orders/:id/status', () => {
    it('admin debe poder cambiar el estado de una orden', async () => {
        const res = await request(app)
            .patch(`/api/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'PAID' })

        expect(res.status).toBe(200)
        expect(res.body.order.status).toBe('PAID')
    })

    it('cliente no debe poder cambiar el estado', async () => {
        const res = await request(app)
            .patch(`/api/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${clientToken}`)
            .send({ status: 'CANCELLED' })

        expect(res.status).toBe(403)
    })
})