'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Calendar, Gamepad2 } from 'lucide-react'
import { getPosts, getCategories, type WordPressPost, type WordPressCategory } from '@/lib/wordpress'

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

export default function GamesLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>(['Tümü'])
  const [loading, setLoading] = useState(true)
  const [wpCategories, setWpCategories] = useState<WordPressCategory[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // WordPress'ten veri çek - Games kategorisi için
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [{ posts, totalPages }, cats] = await Promise.all([
          getPosts({ per_page: POSTS_PER_PAGE, page: currentPage }),
          getCategories(),
        ])

        // Posts'u dönüştür - Games ile ilgili kategorileri filtrele
        const transformedPosts: Post[] = posts
          .filter((post: WordPressPost) => {
            const categoryIds = post.categories || []
            const postCategories = cats.filter((c) => categoryIds.includes(c.id))
            return postCategories.some((c) => 
              c.name.toLowerCase().includes('game') || 
              c.name.toLowerCase().includes('oyun') ||
              c.slug.toLowerCase().includes('game') ||
              c.slug.toLowerCase().includes('oyun')
            )
          })
          .map((post: WordPressPost) => {
            const excerptText = post.excerpt.rendered
              .replace(/<[^>]*>/g, '')
              .trim()
              .substring(0, 150)

            const thumbnailUrl =
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url || undefined

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

        // Kategorileri ayarla - sadece games ile ilgili olanları göster
        const gamesCategories = cats.filter((c) => 
          c.name.toLowerCase().includes('game') || 
          c.name.toLowerCase().includes('oyun') ||
          c.slug.toLowerCase().includes('game') ||
          c.slug.toLowerCase().includes('oyun')
        )
        const categoryNames = ['Tümü', ...gamesCategories.map((c) => c.name)]
        setCategories(categoryNames)
        setWpCategories(cats)
      } catch (error) {
        console.error('Error fetching games data:', error)
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-slate-400 font-mono">Oyun yazıları yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
          Oyun Geliştirme Yazıları
        </h2>
        <p className="text-slate-400 text-lg font-mono">
          // Oyun geliştirme evreninden tüm içerikler
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Oyun yazılarında ara..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 glass rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-700 focus:border-cyan-400/50"
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 font-mono ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'glass text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-400/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <>
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
                <Link href={`/games/${post.slug}`}>
                  <div className="glass rounded-2xl h-full flex flex-col hover:bg-slate-900/50 transition-all duration-300 overflow-hidden border border-slate-700">
                    {post.thumbnailUrl ? (
                      <div className="w-full h-44 overflow-hidden border-b border-slate-700">
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-orange-500/20 flex items-center justify-center border-b border-slate-700">
                        <Gamepad2 className="w-16 h-16 text-cyan-400/50" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-400/30 rounded-full text-xs font-semibold font-mono">
                          {post.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors font-mono">
                        {post.title}
                      </h3>

                      <p className="text-slate-300 text-sm mb-4 flex-grow">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center space-x-2 text-slate-500 text-xs pt-4 border-t border-slate-700 mt-auto font-mono">
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
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 font-mono ${
                  currentPage === 1
                    ? 'glass text-slate-500 cursor-not-allowed opacity-60 border border-slate-700'
                    : 'glass hover:text-cyan-400 border border-slate-700 hover:border-cyan-400/50'
                }`}
              >
                Önceki
              </button>

              <span className="text-slate-400 text-sm font-mono">
                Sayfa <span className="font-semibold">{currentPage}</span> /{' '}
                <span className="font-semibold">{totalPages}</span>
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 font-mono ${
                  currentPage === totalPages
                    ? 'glass text-slate-500 cursor-not-allowed opacity-60 border border-slate-700'
                    : 'glass hover:text-cyan-400 border border-slate-700 hover:border-cyan-400/50'
                }`}
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <Gamepad2 className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400 text-lg mb-4 font-mono">
            {allPosts.length === 0
              ? '// Henüz oyun geliştirme yazısı yok. Yakında eklenecek!'
              : '// Aradığınız kriterlere uygun içerik bulunamadı.'}
          </p>
          <div className="glass rounded-xl p-6 max-w-md mx-auto text-left mt-6 border border-slate-700">
            <p className="text-slate-300 text-sm font-mono">
              <strong className="text-cyan-400">Not:</strong> Oyun geliştirme yazıları WordPress'te "Games" veya "Oyun" kategorisinde olmalıdır.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

