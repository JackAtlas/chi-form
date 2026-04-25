'use server'

import { signIn } from '@/auth'
import prisma from '@/lib/prisma'
import { loginSchema } from '@/schemas/auth'

export async function login(
  formData: FormData
): Promise<{ error: string | null }> {
  try {
    const raw = {
      username: formData.get('username'),
      password: formData.get('password')
    }

    const parsed = loginSchema.safeParse(raw)

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || '参数错误'
      }
    }

    const { username, password } = parsed.data
    const normalizedUsername = username.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { name: normalizedUsername }
    })

    if (!user) {
      return { error: '用户不存在' }
    }

    await signIn('credentials', {
      username: normalizedUsername,
      password,
      redirect: false
    })

    return { error: null }
  } catch (err) {
    return { error: '登录失败，请稍后再试' }
  }
}
