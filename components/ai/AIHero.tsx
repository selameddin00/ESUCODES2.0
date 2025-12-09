'use client'

import { useEffect, useState, MouseEvent } from 'react'
import { motion } from 'framer-motion'

// Matrix benzeri karakter havuzu - sayılar, harfler ve bazı semboller
const MATRIX_CHARS = 'TAGC'

function generateColumnChars(length: number) {
  return Array.from({ length }).map(
    () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
  )
}

// Daha sık akış için kolon ve karakter sayısını arttır
const codeColumns = Array.from({ length: 16 }).map((_, index) =>
  generateColumnChars(24 + (index % 4) * 4)
)

// Hero altindaki hareketli bant icin gosterilecek kelimeler
const tickerItems = [
  'Neural Networks',
  'Transformers',
  'Computer Vision',
  'NLP',
  'OpenAI',
  'DeepMind',
  'ESUCODES AI LAB',
]

export default function AIHero() {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'ESUCODES'
  const sloganWords = ['AI.', 'Code.', 'Evolution.']
  const [showEye, setShowEye] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setShowEye(true)
      }
    }, 150)

    return () => clearInterval(typingInterval)
  }, [])

  // SSR ve client arasindaki random kaynakli farklari engellemek icin
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    setMousePos({
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
    })
  }

  // Goz bebegi hareket alani - daha genis bir alan icin deger arttirildi
  const pupilOffsetX = (mousePos.x - 0.5) * 44
  const pupilOffsetY = (mousePos.y - 0.5) * 44

  if (!mounted) {
    return null
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Blackhole Effect - Concentric Circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-white/10 rounded-full"
            style={{
              width: `${200 + i * 150}px`,
              height: `${200 + i * 150}px`,
            }}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 3 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          />
        ))}
      </div>

      {/* Particle Effect - White dots */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => {
          const randomX = Math.random() * 100
          const randomY = Math.random() * 100
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: `${randomX}%`,
                y: `${randomY}%`,
              }}
              animate={{
                x: `${(randomX + Math.random() * 20 - 10)}%`,
                y: `${(randomY + Math.random() * 20 - 10)}%`,
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          )
        })}
      </div>

      {/* Vertical code rain - matrix-like effect (dikey karakterler) */}
      <div className="pointer-events-none absolute inset-0 flex justify-between px-6 opacity-60">
        {codeColumns.map((column, columnIndex) => (
          <motion.div
            key={columnIndex}
            className="relative flex-1 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: columnIndex * 0.15 }}
          >
            <motion.div
              className="font-mono text-sm text-white/80 flex flex-col space-y-0.5"
              initial={{ y: '-110%' }}  // Hepsi navbar hizasından başlasın
              animate={{ y: '110%' }}
              transition={{
                // Daha hızlı ve sık akış
                duration: 7 + columnIndex * 1.2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {column.map((char, charIndex) => (
                <div
                  key={charIndex}
                  className="whitespace-pre leading-4"
                >
                  {char}
                </div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white">
            {displayText}
            <span className="animate-pulse">|</span>
          </span>
        </motion.h1>

        {showEye && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-36 h-36 rounded-full border-2 border-white/60 flex items-center justify-center bg-black/70 overflow-hidden"
              animate={{
                scaleY: [1, 0.05, 1],
              }}
              transition={{
                scaleY: {
                  duration: 0.2,
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                  repeatDelay: 3,
                },
              }}
            >
              <div className="w-24 h-24 rounded-full border border-white/40 flex items-center justify-center bg-black">
                <motion.div
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center"
                  animate={{ x: pupilOffsetX, y: pupilOffsetY }}
                  transition={{ type: 'spring', stiffness: 220, damping: 9, mass: 0.18 }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-black" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.p
          className="text-xl md:text-2xl text-gray-400 mb-8 font-mono space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {sloganWords.map((word, index) => (
            <span
              key={index}
              className="cursor-default transition duration-200 hover:text-red-500 hover:[text-shadow:0_0_16px_rgba(248,113,113,0.9)]"
            >
              {word}
            </span>
          ))}
        </motion.p>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2 mx-auto"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Orta kisimda hareketli AI ticker - beyaz dikdortgen icinde siyah yazi */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24">
        <div className="pointer-events-auto w-full rounded-none border-y-2 border-black bg-white/95 px-2 py-2 shadow-lg overflow-hidden">
          <motion.div
            className="flex font-mono text-xs md:text-sm text-black"
            initial={{ x: '0%' }}
            animate={{ x: '-50%' }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[0, 1].map((loopIndex) => (
              <div
                key={loopIndex}
                className="flex shrink-0 min-w-full gap-6 px-4 py-1 whitespace-nowrap"
              >
                {tickerItems.map((item, index) => (
                  <span
                    key={`${loopIndex}-${index}`}
                    className="uppercase tracking-[0.25em] text-black hover:text-red-600 transition-colors duration-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

