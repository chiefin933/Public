import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    console.log('Seed completed')
  } catch (err) {
    console.error('Seed failed (likely no DB).', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
