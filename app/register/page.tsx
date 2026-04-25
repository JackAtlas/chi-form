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
import { register } from '@/actions/auth/register'
import { toast } from 'sonner'
import { LucideLoaderCircle } from 'lucide-react'

type State = {
  error: string | null
}

export default function SignUpPage() {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_: State, formData: FormData): Promise<State> => {
      const result = await register(formData)

      if (!result.error) {
        toast.success('注册成功！')
        router.push('/signIn')
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
            创建账号
          </CardTitle>
          <CardDescription>注册以管理你的表单系统</CardDescription>
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

            {/* 确认密码 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                required
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <Button
              className="w-full cursor-pointer"
              type="submit"
              disabled={pending}
            >
              {pending ? (
                <LucideLoaderCircle className="animate-spin" />
              ) : (
                '创建账号'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            已经有账号？{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              去登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
