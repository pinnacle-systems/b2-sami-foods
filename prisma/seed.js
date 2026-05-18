import bcrypt from 'bcrypt'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const admins = [
  {
    name: 'Admin',
    email: 'admin@b2samifoods.com',
    password: 'Admin@1234',
    mobile: '9000000000',
    role: 'admin',
  },
]

async function main() {
  console.log('Seeding...')

  for (const data of admins) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      console.log(`  skip  ${data.email} (already exists)`)
      continue
    }
    const hashed = await bcrypt.hash(data.password, 10)
    await prisma.user.create({ data: { ...data, password: hashed } })
    console.log(`  created  ${data.email}  role=${data.role}`)
  }

  console.log('Done.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
