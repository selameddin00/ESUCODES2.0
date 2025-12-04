'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Brain, Code, Newspaper, ExternalLink } from 'lucide-react'

export default function AIContent() {
  // Örnek AI blogları ve projeleri - daha sonra WordPress'ten veya API'den gelecek
  const aiBlogs = [
    {
      id: 1,
      title: 'Machine Learning Temelleri',
      excerpt: 'Yapay zeka ve makine öğrenmesi dünyasına giriş yapın.',
      date: '2024-01-15',
      category: 'AI',
    },
    {
      id: 2,
      title: 'Neural Networks Derinlemesine',
      excerpt: 'Sinir ağlarının nasıl çalıştığını öğrenin.',
      date: '2024-01-20',
      category: 'AI',
    },
  ]

  const aiNews = [
    {
      id: 1,
      title: 'Yeni GPT Modeli Duyuruldu',
      excerpt: 'OpenAI, daha güçlü ve verimli yeni bir dil modeli tanıttı. Model, önceki versiyonlara göre %40 daha hızlı çalışıyor.',
      date: '2024-01-25',
      source: 'TechNews',
      category: 'Geliştirme',
      readTime: '3 dk',
    },
    {
      id: 2,
      title: 'AI ile Tıbbi Teşhis Devrimi',
      excerpt: 'Yapay zeka destekli görüntüleme sistemleri, kanser teşhisinde %95 doğruluk oranına ulaştı.',
      date: '2024-01-24',
      source: 'MedTech',
      category: 'Sağlık',
      readTime: '5 dk',
    },
    {
      id: 3,
      title: 'Otonom Araçlar Yollarda',
      excerpt: 'Tam otonom sürüş teknolojisi, ilk kez genel kullanıma açıldı. Güvenlik testlerinden başarıyla geçti.',
      date: '2024-01-23',
      source: 'AutoTech',
      category: 'Ulaşım',
      readTime: '4 dk',
    },
    {
      id: 4,
      title: 'Quantum AI İşlemci Tanıtıldı',
      excerpt: 'Kuantum bilgisayar ve yapay zeka birleşimi ile geliştirilen yeni işlemci, geleneksel sistemlerden 1000 kat hızlı.',
      date: '2024-01-22',
      source: 'QuantumAI',
      category: 'Teknoloji',
      readTime: '6 dk',
    },
  ]

  const aiProjects = [
    {
      id: 1,
      name: 'AI Chatbot',
      description: 'Doğal dil işleme kullanarak geliştirilmiş akıllı chatbot.',
      status: 'Aktif',
    },
    {
      id: 2,
      name: 'Image Recognition System',
      description: 'Görüntü tanıma ve sınıflandırma sistemi.',
      status: 'Geliştirme Aşamasında',
    },
  ]

  return (
    <div className="bg-black text-white min-h-screen">
      {/* AI Blogs Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center space-x-4 mb-8">
            <Brain className="w-8 h-8 text-white" />
            <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
              AI BLOGLARI
            </h2>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group border border-white/10 bg-white/5 p-6 rounded-lg hover:border-white/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-4">
                  <span className="text-xs font-mono text-gray-400">{blog.date}</span>
                  <span className="text-xs font-mono text-white ml-2 px-2 py-1 bg-white/10 rounded">
                    {blog.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-mono group-hover:text-white transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">{blog.excerpt}</p>
                <Link
                  href={`/blog/${blog.id}`}
                  className="inline-flex items-center text-white font-mono text-sm hover:underline"
                >
                  Devamını Oku
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>

          {aiBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-mono">Henüz AI blog yazısı bulunmamaktadır.</p>
            </div>
          )}
        </motion.div>

        {/* AI News Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="flex items-center space-x-4 mb-8">
            <Newspaper className="w-8 h-8 text-white" />
            <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
              AI HABERLERİ
            </h2>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group border border-white/10 bg-white/5 p-6 rounded-lg hover:border-white/30 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono text-gray-400">{news.date}</span>
                      <span className="text-xs font-mono text-white/60">•</span>
                      <span className="text-xs font-mono text-gray-400">{news.readTime}</span>
                    </div>
                    <span className="text-xs font-mono text-white px-2 py-1 bg-white/10 rounded border border-white/20">
                      {news.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 font-mono group-hover:text-white transition-colors leading-tight">
                    {news.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-2">
                    {news.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500">{news.source}</span>
                    <div className="flex items-center text-white font-mono text-sm group-hover:text-white/80 transition-colors">
                      <span className="mr-2">Devamını Oku</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {aiNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-mono">Henüz AI haberi bulunmamaktadır.</p>
            </div>
          )}
        </motion.div>

        {/* AI Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="flex items-center space-x-4 mb-8">
            <Code className="w-8 h-8 text-white" />
            <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
              AI PROJELERİ
            </h2>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group border border-white/10 bg-white/5 p-8 rounded-lg hover:border-white/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white font-mono">{project.name}</h3>
                  <span className="text-xs font-mono text-white px-3 py-1 bg-white/10 rounded border border-white/20">
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex items-center text-white font-mono text-sm">
                  Detayları Gör
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          {aiProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-mono">Henüz AI projesi bulunmamaktadır.</p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}

