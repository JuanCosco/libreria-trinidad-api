import request from 'supertest'
import app from '../app'
import prisma from '../utils/prisma'

let clientToken: string
let bookId: string
let categoryId: string

beforeAll(async () => {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.book.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany({ where: { email: { in: ['cart-admin@test.com', 'cart-client@test.com'] } } })

    // Crear admin y obtener token
    await request(app).post('/api/auth/register').send({
        nombre: 'Admin', apellido: 'Cart', email: 'cart-admin@test.com', password: 'password123'
    })
    await prisma.user.update({ where: { email: 'cart-admin@test.com' }, data: { role: 'ADMIN' } })
    const adminRes = await request(app).post('/api/auth/login').send({ email: 'cart-admin@test.com', password: 'password123' })
    const adminToken = adminRes.body.token

    // Crear client
    await request(app).post('/api/auth/register').send({
        nombre: 'Client', apellido: 'Cart', email: 'cart-client@test.com', password: 'password123'
    })
    const clientRes = await request(app).post('/api/auth/login').send({ email: 'cart-client@test.com', password: 'password123' })
    clientToken = clientRes.body.token

    // Crear categoría y libro
    const catRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Cart Test Cat' })
    categoryId = catRes.body.category.id

    const bookRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Libro Cart', descripcion: 'Test', precio: 29.99, descuento: 0, categoryId })
    bookId = bookRes.body.book.id
})

afterAll(async () => {
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.book.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany({ where: { email: { in: ['cart-admin@test.com', 'cart-client@test.com'] } } })
})

describe('GET /api/cart', () => {
    it('debe retornar carrito vacío para usuario nuevo', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(res.status).toBe(200)
        expect(res.body.cart).toBeDefined()
        expect(res.body.cart.items).toHaveLength(0)
    })

    it('debe rechazar sin autenticación', async () => {
        const res = await request(app).get('/api/cart')
        expect(res.status).toBe(401)
    })
})

describe('POST /api/cart/items', () => {
    it('debe agregar un libro al carrito', async () => {
        const res = await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${clientToken}`)
            .send({ bookId, cantidad: 2 })

        expect(res.status).toBe(200)
        expect(res.body.item).toBeDefined()
        expect(res.body.item.cantidad).toBe(2)
    })

    it('debe acumular cantidad si el libro ya está en el carrito', async () => {
        await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${clientToken}`)
            .send({ bookId, cantidad: 1 })

        const cartRes = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${clientToken}`)

        const item = cartRes.body.cart.items.find((i: { bookId: string }) => i.bookId === bookId)
        expect(item.cantidad).toBe(3)
    })
})

describe('PATCH /api/cart/items/:bookId', () => {
    it('debe actualizar la cantidad de un item', async () => {
        const res = await request(app)
            .patch(`/api/cart/items/${bookId}`)
            .set('Authorization', `Bearer ${clientToken}`)
            .send({ cantidad: 5 })

        expect(res.status).toBe(200)
        expect(res.body.item.cantidad).toBe(5)
    })
})

describe('DELETE /api/cart/items/:bookId', () => {
    it('debe eliminar un item del carrito', async () => {
        const res = await request(app)
            .delete(`/api/cart/items/${bookId}`)
            .set('Authorization', `Bearer ${clientToken}`)

        expect(res.status).toBe(200)

        const cartRes = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(cartRes.body.cart.items).toHaveLength(0)
    })
})

describe('DELETE /api/cart', () => {
    it('debe vaciar el carrito', async () => {
        await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${clientToken}`)
            .send({ bookId, cantidad: 2 })

        const res = await request(app)
            .delete('/api/cart')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(res.status).toBe(200)

        const cartRes = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${clientToken}`)

        expect(cartRes.body.cart.items).toHaveLength(0)
    })
})