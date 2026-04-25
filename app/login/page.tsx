'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { login } from '@/actions/auth/login'
import { toast } from 'sonner'

type State = {
  error: string | null
}

export default function SignInPage() {
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async (_: State, formData: FormData): Promise<State> => {
      const result = await login(formData)

      if (!result.error) {
        toast.success('登录成功！')
        router.push('/')
      }

      return result
    },
    { error: null }
  )

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            登录账号
          </CardTitle>
          <CardDescription>登录以继续使用系统</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-5">
            {/* 用户名 */}
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                placeholder="请输入用户名"
                required
              />
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                required
              />
            </div>

            {/* 错误提示 */}
            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <Button
              className="w-full cursor-pointer"
              type="submit"
              disabled={pending}
            >
              {pending ? '登录中...' : '登录'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            还没有账号？{' '}
            <Link
              href="/signUp"
              className="font-medium text-primary hover:underline"
            >
              去注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
