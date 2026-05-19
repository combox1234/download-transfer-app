import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body as { email: string; password: string }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Try to proxy to backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    try {
      const backendRes = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (backendRes.ok) {
        const data = await backendRes.json()
        const response = NextResponse.json({
          success: true,
          user: { id: data.userId || 'user-001', email },
        })
        response.cookies.set('auth_token', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400,
          path: '/',
        })
        return response
      }
    } catch {
      // Backend unavailable — fall through to mock
    }

    // Mock auth: accept any credentials for demo
    const mockToken = `mock-jwt-${Date.now()}`
    const response = NextResponse.json({
      success: true,
      user: { id: 'user-001', email },
    })
    response.cookies.set('auth_token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
