import z from 'zod'

export const registerSchema = z
  .object({
    username: z.string().min(3, '用户名至少 3 位').max(20),
    password: z.string().min(6, '密码至少 6 位'),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword']
  })

export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空')
})
