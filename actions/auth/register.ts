'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function register(
  formData: FormData
): Promise<{ error: string | null }> {
  const username = formData
    .get('username')
    ?.toString()
    .toLowerCase()
    .trim()
  const password = formData.get('password')?.toString().trim()
  const confirmPassword = formData.get('password')?.toString().trim()

  if (!username || !password || !confirmPassword)
    return { error: '用户名和密码不能为空' }

  if (password !== confirmPassword)
    return { error: '两次输入的密码不一致' }

  const existingUser = await prisma.user.findUnique({
    where: { name: username }
  })

  if (existingUser) return { error: '用户名已存在' }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name: username,
      passwordHash: hashedPassword
    }
  })

  return { error: null }
}
