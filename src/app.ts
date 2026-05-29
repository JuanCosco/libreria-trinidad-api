import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// Importar rutas
import authRoutes from './routes/auth.routes'
import bookRoutes from './routes/book.routes'
import categoryRoutes from './routes/category.routes'
import cartRoutes from './routes/cart.routes'
import orderRoutes from './routes/order.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'Tienda Online API ' })
})

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})

export default app