'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Calendar } from 'lucide-react'
import { getPosts, getCategories, type WordPressPost, type WordPressCategory } from '@/actions/wordpress-data'
import { stripHtmlTags } from '@/lib/text/stripHtmlTags'

const POSTS_PER_PAGE = 12

interface Post {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  thumbnailUrl?: string
}

export default function BlogLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>(['Tümü'])
  const [loading, setLoading] = useState(true)
  const [wpCategories, setWpCategories] = useState<WordPressCategory[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // WordPress'ten veri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Debug logging - only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('WordPress API URL:', process.env.NEXT_PUBLIC_WORDPRESS_API_URL)
        }
        
        const [{ posts, totalPages }, cats] = await Promise.all([
          getPosts({ per_page: POSTS_PER_PAGE, page: currentPage }),
          getCategories(),
        ])

        // Debug logging - only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Fetched posts:', posts.length)
          console.log('Fetched categories:', cats.length)
          console.log('Total pages:', totalPages)
        }

        if (posts.length === 0 && process.env.NODE_ENV === 'development') {
          console.warn('WordPress\'ten hiç yazı gelmedi. WordPress\'te yazı olduğundan emin olun.')
        }

        // Posts'u dönüştür
        const transformedPosts: Post[] = posts.map((post: WordPressPost) => {
          // HTML'den text çıkar (regex-free, deterministic state machine)
          const excerptText = stripHtmlTags(post.excerpt.rendered, 160)
            .trim()
            .substring(0, 150)

          // Öne çıkan görseli al (featured image)
          const thumbnailUrl =
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url || undefined

          // İlk kategoriyi al
          const categoryId = post.categories?.[0]
          const category = cats.find((c) => c.id === categoryId)?.name || 'Uncategorized'

          return {
            id: post.id,
            slug: post.slug,
            title: post.title.rendered,
            excerpt: excerptText + (excerptText.length >= 150 ? '...' : ''),
            date: post.date,
            category,
            thumbnailUrl,
          }
        })

        setAllPosts(transformedPosts)
        setTotalPages(totalPages)

        // Kategorileri ayarla
        const categoryNames = ['Tümü', ...cats.map((c) => c.name)]
        setCategories(categoryNames)
        setWpCategories(cats)
      } catch (error) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching blog data:', error)
          console.error('Error details:', error instanceof Error ? error.message : String(error))
        }
        // Hata durumunda boş array
        setAllPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage])

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'Tümü' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
          <p className="mt-4 text-text-secondary">Yazılar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent">
          Blog Kütüphanesi
        </h1>
        <p className="text-text-secondary text-lg">
          Yazılım evreninden tüm içerikler
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search the universe..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 glass rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-accent-primary text-bg-primary'
                : 'glass text-text-secondary hover:text-accent-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="glass rounded-2xl h-full flex flex-col hover:bg-bg-tertiary transition-all duration-300 overflow-hidden">
                {post.thumbnailUrl && (
                  <div className="w-full h-44 overflow-hidden border-b border-white/10">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                  <span className="px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-accent-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-text-secondary text-sm mb-4 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center space-x-2 text-text-muted text-xs pt-4 border-t border-white/10 mt-auto">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              currentPage === 1
                ? 'glass text-text-muted cursor-not-allowed opacity-60'
                : 'glass hover:text-accent-primary'
            }`}
          >
            Önceki
          </button>

          <span className="text-text-secondary text-sm">
            Sayfa <span className="font-semibold">{currentPage}</span> /{' '}
            <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              currentPage === totalPages
                ? 'glass text-text-muted cursor-not-allowed opacity-60'
                : 'glass hover:text-accent-primary'
            }`}
          >
            Sonraki
          </button>
        </div>
      )}

      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-20">
          {allPosts.length === 0 ? (
            <div className="space-y-4">
              <p className="text-text-muted text-lg">
                WordPress'ten yazı yüklenemedi.
              </p>
              <div className="glass rounded-xl p-6 max-w-md mx-auto text-left">
                <p className="text-text-secondary text-sm mb-2">
                  <strong>Kontrol edin:</strong>
                </p>
                <ul className="text-text-secondary text-sm space-y-1 list-disc list-inside">
                  <li>.env dosyasında NEXT_PUBLIC_WORDPRESS_API_URL doğru mu?</li>
                  <li>WordPress siteniz çalışıyor mu?</li>
                  <li>WordPress'te yayınlanmış yazı var mı?</li>
                  <li>Tarayıcı konsolunda hata var mı? (F12)</li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-text-muted text-lg">
              Aradığınız kriterlere uygun içerik bulunamadı.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

