import Logo from '@/components/Logo'
import LogoutButton from '@/components/LogoutButton'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { ReactNode } from 'react'

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className="flex justify-between items-center border-b border-border h-15 px-4 py-2">
        <Logo />
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <LogoutButton />
        </div>
      </nav>
      <main className="flex w-full grow">{children}</main>
    </div>
  )
}

export default Layout
