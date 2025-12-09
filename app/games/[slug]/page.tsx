import { getPostBySlug } from '@/lib/wordpress'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'

export default async function GamesPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const content = post.content.rendered

  return (
    <article className="container mx-auto px-4 py-20 max-w-4xl">
      {/* Back Button */}
      <Link
        href="/games"
        className="inline-flex items-center gap-2 mb-8 glass rounded-lg px-4 py-2 hover:bg-bg-tertiary transition-colors border border-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Games'e Dön</span>
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
          {post.title.rendered}
        </h1>
        <div className="flex items-center gap-4 text-slate-500 text-sm font-mono">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white
          prose-p:text-slate-300
          prose-a:text-cyan-400
          prose-strong:text-white
          prose-code:text-purple-400
          prose-pre:bg-black/40
          prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-slate-700">
        <Link
          href="/games"
          className="inline-flex items-center gap-2 glass rounded-lg px-4 py-2 hover:bg-bg-tertiary transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Yazıları Görüntüle</span>
        </Link>
      </footer>
    </article>
  )
}

