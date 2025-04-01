import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChiForm',
  description: '一款表单生成工具'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
