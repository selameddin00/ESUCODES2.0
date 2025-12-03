'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { getPosts, type WordPressPost } from '@/lib/wordpress'

interface Post {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
}

export default function LatestLogs() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const { posts } = await getPosts({ per_page: 3 })
        
        // Posts'u dönüştür
        const transformedPosts: Post[] = posts.map((post: WordPressPost) => {
          const excerptText = post.excerpt.rendered
            .replace(/<[^>]*>/g, '')
            .trim()
            .substring(0, 100)

          return {
            id: post.id,
            slug: post.slug,
            title: post.title.rendered,
            excerpt: excerptText + '...',
            date: post.date,
            category: 'Blog', // Varsayılan kategori
          }
        })

        setLatestPosts(transformedPosts)
      } catch (error) {
        console.error('Error fetching latest posts:', error)
        setLatestPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPosts()
  }, [])
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent">
          Son Loglar
        </h2>
        <p className="text-text-secondary">Yazılım evreninden son haberler</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
        </div>
      ) : latestPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Henüz blog yazısı bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post, index) => (
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
              <div className="glass rounded-2xl p-6 h-full flex flex-col hover:bg-bg-tertiary transition-all duration-300">
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

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-text-muted text-xs">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-accent-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link href="/blog">
          <motion.button
            className="px-8 py-4 glass rounded-xl text-accent-primary hover:bg-accent-primary hover:text-bg-primary transition-all duration-300 font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tüm Logları Gör
          </motion.button>
        </Link>
      </div>
    </section>
  )
}

