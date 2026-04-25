import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'

export async function proxy(request: NextRequest) {
  const session = await auth()

  const isLoggedIn = !!session?.user

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
