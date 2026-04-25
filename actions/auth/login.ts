'use server'

import { signIn } from '@/auth'
import prisma from '@/lib/prisma'

export async function login(
  formData: FormData
): Promise<{ error: string | null }> {
  try {
    const username = formData
      .get('username')
      ?.toString()
      .toLowerCase()
      .trim()
    const password = formData.get('password')?.toString()

    if (!username || !password) {
      return { error: '用户名和密码不能为空' }
    }

    const user = await prisma.user.findUnique({
      where: { name: username }
    })

    if (!user) {
      return { error: '用户不存在' }
    }

    await signIn('credentials', {
      username,
      password,
      redirect: false
    })

    return { error: null }
  } catch (err) {
    return { error: '登录失败，请稍后再试' }
  }
}
