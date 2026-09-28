import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('bayam_token')?.value

  const isAccount = request.nextUrl.pathname.startsWith('/compte')
  const isAdmin = request.nextUrl.pathname.startsWith('/admin')
  const isAuth = ['/connexion', '/inscription', '/mot-de-passe-oublie'].some((p) =>
    request.nextUrl.pathname.startsWith(p)
  )

  // Not signed in on a protected route → /connexion
  if ((isAccount || isAdmin) && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/connexion'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Already signed in on an auth page → homepage
  if (isAuth && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/compte/:path*', '/admin/:path*', '/connexion', '/inscription', '/mot-de-passe-oublie'],
}
