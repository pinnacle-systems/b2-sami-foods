if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Server will not start.')
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is not set. Server will not start.')
  process.exit(1)
}

export const JWT_SECRET    = process.env.JWT_SECRET
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
export const PORT          = process.env.PORT || 5000
export const CLIENT_URL    = process.env.CLIENT_URL || 'http://localhost:5173'
