'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'node:crypto'
import { LoginSchema } from '@/lib/schemas/auth'
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit'
import { verifyCsrfToken } from '@/lib/csrf'
import { TrustedError, SystemError, logError, getSafeErrorMessage } from '@/lib/errors'
import { secureRandomBool } from '@/lib/security/secureRandom'

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || ''

export interface LoginResult {
  success: boolean
  error?: string
}

export interface SessionData {
  sessionId: string
  username: string
  expiresAt: number
  createdAt: number
  lastActivity: number // Timestamp of last activity (for sliding window timeout)
}

interface StoredSession {
  token: string
  userId: string
  username: string
  expiresAt: number
  createdAt: number
  lastActivity: number // Timestamp of last activity (for sliding window timeout)
}

/**
 * In-Memory Session Store
 * TODO: Replace with Redis/Database for production
 * 
 * Note: This is a temporary solution. In production, use:
 * - Redis for distributed session storage
 * - Database (PostgreSQL/MySQL) for persistent session tracking
 * - Consider using Next.js middleware with external session store
 */
const sessionStore = new Map<string, StoredSession>()

/**
 * Session timeout duration (30 minutes of inactivity)
 */
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

/**
 * Clean up expired sessions
 * TODO: Replace with Redis TTL or database cleanup job
 * 
 * Note: In production with Redis, use TTL (Time To Live) feature
 * In production with Database, use scheduled cleanup job (cron)
 */
function cleanupExpiredSessions() {
  const now = Date.now()
  for (const [token, session] of sessionStore.entries()) {
    // Check absolute expiration
    if (now > session.expiresAt) {
      sessionStore.delete(token)
      continue
    }
    // Check sliding window timeout (30 minutes inactivity)
    const timeSinceLastActivity = now - session.lastActivity
    if (timeSinceLastActivity > SESSION_TIMEOUT_MS) {
      sessionStore.delete(token)
    }
  }
}

// Cleanup is called during session validation
// TODO: In production, use Redis TTL or database cleanup job instead

/**
 * Generate a cryptographically secure session token
 * Uses crypto.randomBytes for high entropy (256 bits)
 */
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Store a session in the session store
 * TODO: Replace with Redis/Database storage
 * 
 * @param token - The session token
 * @param userId - The user identifier (username or user ID)
 * @param username - The username for display purposes
 * @param expiresAt - Unix timestamp when session expires
 */
function storeSession(
  token: string,
  userId: string,
  username: string,
  expiresAt: number
): void {
  // TODO: Replace with Redis/Database
  // Example Redis: await redis.setex(`session:${token}`, ttl, JSON.stringify(sessionData))
  // Example DB: await db.sessions.create({ token, userId, username, expiresAt, lastActivity })
  
  const now = Date.now()
  sessionStore.set(token, {
    token,
    userId,
    username,
    expiresAt,
    createdAt: now,
    lastActivity: now, // Initialize lastActivity on session creation
  })
}

/**
 * Validate a session token with sliding window timeout
 * Implements 30-minute inactivity timeout (sliding window pattern)
 * 
 * TODO: Replace with Redis/Database lookup
 * 
 * @param token - The session token to validate
 * @param updateActivity - Whether to update lastActivity timestamp (default: true)
 * @returns Session data if valid, null otherwise
 */
function validateSession(token: string, updateActivity: boolean = true): StoredSession | null {
  // TODO: Replace with Redis/Database
  // Example Redis: const sessionData = await redis.get(`session:${token}`)
  // Example DB: const session = await db.sessions.findOne({ where: { token } })
  
  const session = sessionStore.get(token)
  
  if (!session) {
    return null
  }
  
  const now = Date.now()
  
  // Check if session has expired (absolute expiration)
  if (now > session.expiresAt) {
    // Clean up expired session
    sessionStore.delete(token)
    return null
  }
  
  // Check sliding window timeout (30 minutes of inactivity)
  const timeSinceLastActivity = now - session.lastActivity
  if (timeSinceLastActivity > SESSION_TIMEOUT_MS) {
    // Session timed out due to inactivity
    sessionStore.delete(token)
    return null
  }
  
  // Update lastActivity timestamp (sliding window - active users stay logged in)
  if (updateActivity) {
    session.lastActivity = now
    sessionStore.set(token, session)
  }
  
  // Periodic cleanup (runs on every validation)
  // TODO: In production, use Redis TTL or database cleanup job
  if (secureRandomBool(0.01)) { // ~1% chance to run cleanup
    cleanupExpiredSessions()
  }
  
  return session
}

/**
 * Remove a session from the store
 * TODO: Replace with Redis/Database deletion
 * 
 * @param token - The session token to invalidate
 */
function removeSession(token: string): void {
  // TODO: Replace with Redis/Database
  // Example Redis: await redis.del(`session:${token}`)
  // Example DB: await db.sessions.destroy({ where: { token } })
  
  sessionStore.delete(token)
}

/**
 * Login with WordPress credentials and set HttpOnly cookie
 */
export async function loginWithWordPress(
  username: string,
  password: string,
  csrfToken?: string
): Promise<LoginResult> {
  try {
    // CSRF Protection - Verify token before processing
    if (csrfToken) {
      const isValidCsrf = await verifyCsrfToken(csrfToken)
      if (!isValidCsrf) {
        logError(new SystemError('CSRF validation failed'), { username, hasToken: !!csrfToken })
        return {
          success: false,
          error: 'Kullanıcı adı veya şifre hatalı.',
        }
      }
    }

    // Rate limiting - Brute force protection
    // Get client IP address from headers
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp || '127.0.0.1'

    // Check rate limit: 5 attempts per minute per IP
    const rateLimitResult = checkRateLimit(clientIp, 5, 60 * 1000)

    if (!rateLimitResult.success) {
      // Rate limit exceeded - do not process login attempt
      const resetTime = new Date(rateLimitResult.reset)
      const secondsUntilReset = Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      
      return {
        success: false,
        error: `Çok fazla deneme yaptınız. Lütfen ${secondsUntilReset} saniye sonra tekrar deneyin.`,
      }
    }

    // Server-side validation with Zod - Security layer
    const validationResult = LoginSchema.safeParse({ username, password })
    
    if (!validationResult.success) {
      // Log validation errors for debugging
      logError(new SystemError('Login validation failed'), {
        username,
        errors: validationResult.error.errors,
      })
      // Generic error message to prevent information leakage
      return {
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı.',
      }
    }

    // Use validated and trimmed values
    const { username: validatedUsername, password: validatedPassword } = validationResult.data

    if (!WORDPRESS_API_URL) {
      logError(new SystemError('WordPress API URL not configured'), { username: validatedUsername })
      return {
        success: false,
        error: 'Servis şu an yanıt vermiyor. Lütfen daha sonra tekrar deneyin.',
      }
    }

    // Verify credentials with WordPress API
    // Use validated and trimmed values
    const credentials = Buffer.from(`${validatedUsername}:${validatedPassword}`).toString('base64')

    let response: Response
    try {
      response = await fetch(`${WORDPRESS_API_URL}/users/me`, {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        cache: 'no-store',
      })
    } catch (fetchError) {
      // Network or fetch error - log full details, return generic message
      logError(new SystemError('WordPress API fetch failed', { username: validatedUsername }), {
        originalError: fetchError,
        apiUrl: WORDPRESS_API_URL,
      })
      return {
        success: false,
        error: 'Servis şu an yanıt vermiyor. Lütfen daha sonra tekrar deneyin.',
      }
    }

    if (!response.ok) {
      // Log the actual error for debugging, but return generic message
      // This prevents user enumeration (can't tell if user exists or password is wrong)
      const errorText = await response.text().catch(() => 'Unable to read error response')
      logError(new SystemError('WordPress API authentication failed', { username: validatedUsername }), {
        status: response.status,
        statusText: response.statusText,
        errorResponse: errorText,
      })
      return {
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı.',
      }
    }

    // Successful login - reset rate limit for this IP
    // This allows legitimate users to log in again after logging out
    resetRateLimit(clientIp)

    // Generate cryptographically secure session token
    const sessionToken = generateSessionToken()
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000 // 8 hours

    // Store session in server-side session store
    // TODO: Replace with Redis/Database
    storeSession(sessionToken, validatedUsername, validatedUsername, expiresAt)

    // Store session token in HttpOnly cookie (Secure, SameSite=Strict)
    const cookieStore = cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours in seconds
    })

    // Store session metadata (username, expiresAt) in a separate cookie
    // This allows us to display username without exposing session token
    const now = Date.now()
    const sessionData: SessionData = {
      sessionId: sessionToken,
      username: validatedUsername,
      expiresAt,
      createdAt: now,
      lastActivity: now, // Initialize lastActivity on session creation
    }

    cookieStore.set('admin_session_data', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return {
      success: true,
    }
  } catch (error) {
    // Log full error details for debugging
    logError(new SystemError('Unexpected error during login'), {
      username,
      originalError: error,
    })
    
    // Return generic error message to client
    return {
      success: false,
      error: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.',
    }
  }
}

/**
 * Verify if user has a valid session
 * Returns session data if valid, null otherwise
 * 
 * This function validates the session token against the server-side session store
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    const sessionDataCookie = cookieStore.get('admin_session_data')?.value

    if (!sessionToken) {
      return null
    }

    // Validate session token against server-side store with sliding window timeout
    // TODO: This will use Redis/Database lookup in production
    const storedSession = validateSession(sessionToken, true) // Update lastActivity on validation

    if (!storedSession) {
      // Session not found, expired, or timed out due to inactivity - clean up cookies
      cookieStore.delete('admin_session')
      cookieStore.delete('admin_session_data')
      return null
    }

    // Verify token matches stored session
    if (storedSession.token !== sessionToken) {
      cookieStore.delete('admin_session')
      cookieStore.delete('admin_session_data')
      return null
    }

    // Parse cookie data for additional metadata
    let sessionData: SessionData | null = null
    if (sessionDataCookie) {
      try {
        const parsed = JSON.parse(sessionDataCookie)
        // Ensure session ID matches
        if (parsed.sessionId !== sessionToken) {
          return null
        }
        // Use lastActivity from store (most up-to-date)
        sessionData = {
          sessionId: storedSession.token,
          username: storedSession.username,
          expiresAt: storedSession.expiresAt,
          createdAt: storedSession.createdAt,
          lastActivity: storedSession.lastActivity, // Use updated lastActivity from store
        }
      } catch {
        // If cookie parsing fails, use data from store
        sessionData = {
          sessionId: storedSession.token,
          username: storedSession.username,
          expiresAt: storedSession.expiresAt,
          createdAt: storedSession.createdAt,
          lastActivity: storedSession.lastActivity,
        }
      }
    } else {
      // Fallback to store data if cookie is missing
      sessionData = {
        sessionId: storedSession.token,
        username: storedSession.username,
        expiresAt: storedSession.expiresAt,
        createdAt: storedSession.createdAt,
        lastActivity: storedSession.lastActivity,
      }
    }

    // Update cookie with latest lastActivity (sliding window)
    cookieStore.set('admin_session_data', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours in seconds
    })

    return sessionData
  } catch (error) {
    logError(new SystemError('Session verification error'), {
      originalError: error,
    })
    return null
  }
}

/**
 * Check if user is authenticated (simple boolean check)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/admin/login'): Promise<SessionData> {
  const session = await getSession()
  
  if (!session) {
    redirect(redirectTo)
  }

  return session
}

/**
 * Logout - invalidate session and clear cookies
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('admin_session')?.value

  // Remove session from server-side store
  // TODO: Replace with Redis/Database deletion
  if (sessionToken) {
    removeSession(sessionToken)
  }

  // Clear cookies
  cookieStore.delete('admin_session')
  cookieStore.delete('admin_session_data')
}

