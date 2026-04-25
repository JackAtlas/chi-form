import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'

export async function proxy(request: NextRequest) {
  const session = await auth()

  const isLoggedIn = !!session?.user
  const { pathname } = request.nextUrl

  const authPages = ['/login', '/register']
  const publicPages = ['/submit']

  const isAuthPage = authPages.includes(pathname)
  const isPublicPage = publicPages.includes(pathname)

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  }

  if (isPublicPage) {
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
