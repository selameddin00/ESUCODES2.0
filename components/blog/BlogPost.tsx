'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getPostBySlug, getPosts, type WordPressPost } from '@/lib/wordpress'

interface Post {
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  date: string
  readTime: string
  category: string
  image?: string
  hasAuthor: boolean
}

interface RelatedPost {
  slug: string
  title: string
}

// Fallback mock data
const mockPost = {
  title: 'Siber Güvenlik Trendleri 2025',
  content: `
    <p>2025 yılında siber güvenlik alanında önemli gelişmeler yaşanıyor. Bu yazıda, öne çıkan trendleri inceleyeceğiz.</p>
    
    <h2>Zero Trust Güvenlik Modeli</h2>
    <p>Zero Trust, "hiçbir şeye güvenme, her şeyi doğrula" prensibine dayanan bir güvenlik modelidir. Bu model, geleneksel güvenlik yaklaşımlarından farklı olarak, ağ içindeki veya dışındaki tüm trafiği şüpheli kabul eder.</p>
    
    <pre><code class="language-javascript">
const authenticate = async (user) => {
  const token = await generateToken(user);
  return verifyToken(token);
};
    </code></pre>
    
    <h2>Yapay Zeka Destekli Tehdit Tespiti</h2>
    <p>AI teknolojileri, siber saldırıları tespit etmede kritik bir rol oynuyor. Machine learning algoritmaları, anormal davranışları tespit ederek güvenlik ekiplerine erken uyarı sağlıyor.</p>
    
    <h2>Cloud Security</h2>
    <p>Bulut güvenliği, modern işletmeler için en önemli önceliklerden biri haline geldi. Shared responsibility model'i anlamak ve doğru güvenlik politikaları uygulamak kritik.</p>
  `,
  author: null,
  date: '2025-01-15',
  readTime: '5 dk',
  category: 'Cyber Security',
  hasAuthor: false,
}

const relatedPosts = [
  {
    slug: 'ai-ve-gelecek',
    title: 'Yapay Zeka ve Yazılım Geliştirme',
  },
  {
    slug: 'nextjs-14-rehber',
    title: 'Next.js 14 App Router Rehberi',
  },
]

export default function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)

  // WordPress API'den veri çekme
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const wpPost = await getPostBySlug(slug)

        if (wpPost) {
          const wordCount = wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length
          const readTime = Math.ceil(wordCount / 200)
          const wpAuthor = wpPost._embedded?.author?.[0]
          const hasAuthor = !!wpAuthor?.name
          const authorName = wpAuthor?.name || ''
          const authorAvatar =
            (wpAuthor?.avatar_urls &&
              (wpAuthor.avatar_urls['96'] ||
                wpAuthor.avatar_urls['48'] ||
                wpAuthor.avatar_urls['24'])) ||
            ''

          const transformedPost: Post = {
            title: wpPost.title.rendered,
            content: wpPost.content.rendered,
            author: {
              name: authorName,
              avatar: authorAvatar,
            },
            date: wpPost.date,
            readTime: `${readTime} dk`,
            category: 'Blog',
            image:
              wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
              undefined,
            hasAuthor,
          }

          setPost(transformedPost)

          // İlgili yazıları çek
          const { posts: allPosts } = await getPosts({ per_page: 5 })
          const related = allPosts
            .filter((p: WordPressPost) => p.id !== wpPost.id)
            .slice(0, 2)
            .map((p: WordPressPost) => ({
              slug: p.slug,
              title: p.title.rendered,
            }))
          setRelatedPosts(related)
        } else {
          // WordPress'ten veri gelmezse mock data kullan
          setPost(mockPost as unknown as Post)
          setRelatedPosts([
            { slug: 'ai-ve-gelecek', title: 'Yapay Zeka ve Yazılım Geliştirme' },
            { slug: 'nextjs-14-rehber', title: 'Next.js 14 App Router Rehberi' },
          ])
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        // Hata durumunda mock data kullan
        setPost(mockPost as unknown as Post)
        setRelatedPosts([
          { slug: 'ai-ve-gelecek', title: 'Yapay Zeka ve Yazılım Geliştirme' },
          { slug: 'nextjs-14-rehber', title: 'Next.js 14 App Router Rehberi' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const handleShare = async () => {
    if (!post) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.replace(/<[^>]*>/g, '').substring(0, 100),
          url: window.location.href,
        })
      } catch (err) {
        console.log('Paylaşım iptal edildi')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link kopyalandı!')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
          <p className="mt-4 text-text-secondary">Yazı yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-text-primary">Yazı Bulunamadı</h1>
          <Link href="/blog" className="text-accent-primary hover:text-accent-tertiary">
            ← Blog&apos;a Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-accent-primary hover:text-accent-tertiary transition-colors mb-8"
        >
          ← Blog&apos;a Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Card - Left Side (2 columns) */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl overflow-hidden">
              {post.image && (
                <div className="w-full h-72 md:h-96 overflow-hidden border-b border-white/10">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8 md:p-10">
                <div className="mb-6">
                <span className="px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-sm font-semibold">
                  {post.category}
                </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm mb-8 pb-8 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} okuma süresi</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 hover:text-accent-primary transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Paylaş</span>
                  </button>
                </div>

                {/* Article Content */}
                <div
                  className="
                prose prose-lg prose-invert max-w-none
                prose-headings:text-text-primary prose-headings:font-bold
                prose-p:text-text-secondary prose-p:leading-relaxed
                prose-strong:text-accent-primary prose-strong:font-semibold
                prose-a:text-accent-primary prose-a:no-underline hover:prose-a:text-accent-secondary hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                prose-li:marker:text-accent-tertiary /* Madde işaretleri Cyan rengi olur */
                prose-blockquote:border-l-4 prose-blockquote:border-accent-primary
                prose-blockquote:bg-bg-secondary/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                prose-blockquote:italic prose-blockquote:text-text-muted
                prose-code:text-accent-tertiary
                prose-code:bg-bg-secondary
                prose-code:px-1.5 prose-code:py-0.5
                prose-code:rounded-md
                prose-code:before:content-none prose-code:after:content-none /* Tırnakları temizler */
                prose-pre:bg-[#1e293b] /* Kod editörü gibi koyu arka plan */
                prose-pre:border prose-pre:border-white/10
                prose-pre:shadow-xl
            "
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>
          </motion.article>

          {/* Sidebar - Right Side (1 column) */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Author Card (sadece gerçek yazar bilgisi varsa göster) */}
            {post.hasAuthor && post.author.name && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Yazar
                </h3>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-accent-primary to-accent-tertiary flex items-center justify-center text-3xl font-bold mb-4">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{post.author.name.charAt(0)}</span>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-2">
                    {post.author.name}
                  </h4>
                </div>
              </motion.div>
            )}

            {/* Related Posts Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold mb-6 text-text-primary">
                İlginizi Çekebilecek Loglar
              </h2>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-all duration-300 border border-white/10"
                  >
                    <h3 className="text-base font-semibold text-text-primary hover:text-accent-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  )
}
