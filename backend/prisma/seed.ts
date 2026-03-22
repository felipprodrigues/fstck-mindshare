import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Role } from '../src/models/user.model'

const prisma = new PrismaClient()

const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plainPassword, salt)
}

async function main() {
  console.log('🌱 Starting seed...')

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@mindshare.com',
    },
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists, updating to admin...')
    await prisma.user.update({
      where: {
        email: 'admin@mindshare.com',
      },
      data: {
        role: Role.admin,
      },
    })
    console.log('✅ Admin user updated successfully!')
  } else {
    // Create admin user
    const hashedPassword = await hashPassword('admin123')

    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@mindshare.com',
        password: hashedPassword,
        role: Role.admin,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@mindshare.com')
    console.log('🔑 Password: admin123')
    console.log('👤 ID:', admin.id)
  }

  console.log('✨ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error executing seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
