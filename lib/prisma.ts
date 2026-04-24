import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL as string

const adapter = new PrismaLibSql({ url: connectionString })

const prismaClientSingleton = () => new PrismaClient({ adapter })

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma

export default prisma
