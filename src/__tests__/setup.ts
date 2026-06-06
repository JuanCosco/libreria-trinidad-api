import { execSync } from 'child_process'
import * as dotenv from 'dotenv'
import '@jest/globals'

dotenv.config({ path: '.env.test' })

beforeAll(async () => {
  // Corre las migraciones en la BD de test
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
  })
})

afterAll(async () => {
  const prisma = (await import('../utils/prisma')).default
  await prisma.$disconnect()
})