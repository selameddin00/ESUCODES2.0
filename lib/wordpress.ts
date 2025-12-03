/**
 * WordPress API Helper Functions
 * Headless WordPress ile iletişim için yardımcı fonksiyonlar
 */

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || ''
const WORDPRESS_AUTH_USER = process.env.NEXT_PUBLIC_WORDPRESS_AUTH_USER || ''
const WORDPRESS_AUTH_PASS = process.env.NEXT_PUBLIC_WORDPRESS_AUTH_PASS || ''

// Base64 encode for Basic Auth
const getAuthHeader = () => {
  if (WORDPRESS_AUTH_USER && WORDPRESS_AUTH_PASS) {
    const credentials = Buffer.from(
      `${WORDPRESS_AUTH_USER}:${WORDPRESS_AUTH_PASS}`
    ).toString('base64')
    return `Basic ${credentials}`
  }
  return ''
}

export interface WordPressPost {
  id: number
  slug: string
  author: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  modified: string
  categories: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
    author?: Array<{
      name: string
      avatar_urls?: {
        24: string
        48: string
        96: string
        [key: string]: string
      }
    }>
  }
}

export interface WordPressCategory {
  id: number
  name: string
  slug: string
}

/**
 * Tüm blog yazılarını getir
 * WordPress total pages bilgisini de döner
 */
export async function getPosts(
  params?: {
    per_page?: number
    page?: number
    categories?: number
    search?: string
  }
): Promise<{ posts: WordPressPost[]; totalPages: number }> {
  try {
    if (!WORDPRESS_API_URL) {
      console.error('WordPress API URL is not configured. Please check your .env file.')
      return { posts: [], totalPages: 1 }
    }

    const queryParams = new URLSearchParams()
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.categories) queryParams.append('categories', params.categories.toString())
    if (params?.search) queryParams.append('search', params.search)

    const url = `${WORDPRESS_API_URL}/posts?_embed&${queryParams.toString()}`
    console.log('Fetching from:', url)
    
    const response = await fetch(url, {
      cache: 'no-store', // Client-side için cache yok
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('WordPress API error:', response.status, response.statusText)
      console.error('Error response:', errorText)
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const totalPagesHeader = response.headers.get('X-WP-TotalPages')
    const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) || 1 : 1

    return { posts: data, totalPages }
  } catch (error) {
    console.error('Error fetching posts:', error)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error: WordPress API\'ye erişilemiyor. URL\'yi kontrol edin.')
    }
    return { posts: [], totalPages: 1 }
  }
}

/**
 * Slug'a göre tek bir blog yazısı getir
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`,
      {
        cache: 'no-store', // Client-side için cache yok
      }
    )

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`)
    }

    const posts = await response.json()
    return posts[0] || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

/**
 * Tüm kategorileri getir
 */
export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/categories`, {
      cache: 'no-store', // Client-side için cache yok
    })

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * WordPress'e yeni yazı gönder (Admin için)
 */
export async function createPost(
  title: string,
  content: string,
  excerpt?: string,
  categories?: number[]
): Promise<WordPressPost | null> {
  try {
    const authHeader = getAuthHeader()
    if (!authHeader) {
      throw new Error('WordPress authentication credentials not configured')
    }

    const response = await fetch(`${WORDPRESS_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        title,
        content,
        excerpt,
        status: 'publish',
        categories: categories || [],
      }),
    })

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating post:', error)
    return null
  }
}

/**
 * WordPress API bağlantısını test et
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/posts?per_page=1`)
    return response.ok
  } catch (error) {
    return false
  }
}

