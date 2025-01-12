import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/auth/signup/complete') {
    const response = NextResponse.next()
    
    // Cache-Control 헤더 설정으로 뒤로 가기 캐시 방지
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    // History API 조작 방지
    response.headers.set(
      'Clear-Site-Data',
      '"cache", "storage"'
    )
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/auth/signup/complete'
} 