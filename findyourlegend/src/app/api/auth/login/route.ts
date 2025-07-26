import { NextRequest, NextResponse } from 'next/server'

interface User {
  id: string
  username: string
  role: string
}

// Parse users from environment variables (server-side)
const parseAuthUsers = () => {
  const authUsers = process.env.AUTH_USERS || 'admin:admin:admin'
  return authUsers.split(',').map((userStr, index) => {
    const [username, password, role] = userStr.trim().split(':')
    return {
      id: (index + 1).toString(),
      username: username || 'admin',
      password: password || 'admin',
      role: role || 'admin'
    }
  })
}

const AUTH_USERS = parseAuthUsers()

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Check credentials against all users
    const foundUser = AUTH_USERS.find(
      user => user.username === username && user.password === password
    )

    if (foundUser) {
      // Return user without password
      const userResponse: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role
      }

      return NextResponse.json({ 
        success: true, 
        user: userResponse 
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}