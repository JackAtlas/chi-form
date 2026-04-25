'use server'

import prisma from '@/lib/prisma'
import { registerSchema } from '@/schemas/auth'
import bcrypt from 'bcryptjs'

export async function register(
  formData: FormData
): Promise<{ error: string | null }> {
  const raw = {
    username: formData.get('username'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  }

  const parsed = registerSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || '参数错误'
    }
  }

  const { username, password } = parsed.data

  const existingUser = await prisma.user.findUnique({
    where: { name: username.toLowerCase().trim() }
  })

  if (existingUser) return { error: '用户名已存在' }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name: username.toLocaleLowerCase().trim(),
      passwordHash: hashedPassword
    }
  })

  return { error: null }
}
