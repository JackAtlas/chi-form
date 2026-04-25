'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { logout } from '@/actions/auth/logout'

export default function LogoutButton() {
  const router = useRouter()

  return (
    <Button className="cursor-pointer" onClick={() => logout()}>
      退出登录
    </Button>
  )
}
