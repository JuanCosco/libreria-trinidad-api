# Librería Trinidad — Backend API

REST API para una tienda online de libros, migrada desde PHP legacy a una arquitectura moderna con Node.js, TypeScript y PostgreSQL.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **ORM:** Prisma v7
- **Base de datos:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Tests:** Jest + Supertest

## Arquitectura

src/
├── routes/          # Definición de endpoints
├── controllers/     # Manejo de request/response
├── services/        # Lógica de negocio
├── repositories/    # Acceso a datos (Prisma)
├── middlewares/     # Auth, roles
├── types/           # Interfaces TypeScript
├── utils/           # Cliente Prisma, helpers
└── tests/       # Tests de integración

## Endpoints

| Módulo     | Método | Ruta                        | Acceso      |
|------------|--------|-----------------------------|-------------|
| Auth       | POST   | /api/auth/register          | Público     |
| Auth       | POST   | /api/auth/login             | Público     |
| Books      | GET    | /api/books                  | Público     |
| Books      | GET    | /api/books/:id              | Público     |
| Books      | POST   | /api/books                  | Admin       |
| Books      | PATCH  | /api/books/:id              | Admin       |
| Books      | DELETE | /api/books/:id              | Admin       |
| Categories | GET    | /api/categories             | Público     |
| Categories | POST   | /api/categories             | Admin       |
| Categories | PATCH  | /api/categories/:id         | Admin       |
| Categories | DELETE | /api/categories/:id         | Admin       |
| Cart       | GET    | /api/cart                   | Autenticado |
| Cart       | POST   | /api/cart/items             | Autenticado |
| Cart       | PATCH  | /api/cart/items/:bookId     | Autenticado |
| Cart       | DELETE | /api/cart/items/:bookId     | Autenticado |
| Cart       | DELETE | /api/cart                   | Autenticado |
| Orders     | POST   | /api/orders                 | Autenticado |
| Orders     | GET    | /api/orders/my              | Autenticado |
| Orders     | GET    | /api/orders/:id             | Autenticado |
| Orders     | GET    | /api/orders                 | Admin       |
| Orders     | PATCH  | /api/orders/:id/status      | Admin       |

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Crear base de datos
createdb tienda_online

# Correr migraciones
npm run db:migrate

# Iniciar servidor
npm run dev
```

## Tests

```bash
# Crear base de datos de test
createdb tienda_online_test

# Correr tests
npm test

# Con cobertura
npm run test:coverage
```

## Variables de entorno

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tienda_online"
JWT_SECRET="tu_secreto_seguro"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
```