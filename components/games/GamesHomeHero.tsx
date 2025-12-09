'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Tetris block colors
const TETRIS_COLORS = {
  I: '#00f0f0', // Cyan
  O: '#f0f000', // Yellow
  T: '#a000f0', // Purple
  S: '#00f000', // Green
  Z: '#f00000', // Red
  J: '#0000f0', // Blue
  L: '#f0a000', // Orange
}

// Tetris block shapes
const TETRIS_SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
}

type TetrisBlockType = keyof typeof TETRIS_SHAPES

function TetrisBlockPreview({ type, x, y, size = 40 }: { type: TetrisBlockType; x: number; y: number; size?: number }) {
  const shape = TETRIS_SHAPES[type]
  const color = TETRIS_COLORS[type]

  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {shape.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell ? (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="absolute border-2 border-white/30"
              style={{
                left: `${colIndex * size}px`,
                top: `${rowIndex * size}px`,
                width: `${size - 4}px`,
                height: `${size - 4}px`,
                backgroundColor: color,
                boxShadow: `0 0 15px ${color}, inset 0 0 10px rgba(255,255,255,0.3)`,
              }}
            />
          ) : null
        )
      )}
    </div>
  )
}

export default function GamesHomeHero() {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'ESUCODES'

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 150)

    return () => clearInterval(typingInterval)
  }, [])

  // Floating tetris blocks
  const floatingBlocks: Array<{ type: TetrisBlockType; x: number; y: number; delay: number }> = [
    { type: 'I', x: 10, y: 15, delay: 0 },
    { type: 'O', x: 80, y: 20, delay: 0.5 },
    { type: 'T', x: 20, y: 70, delay: 1 },
    { type: 'S', x: 70, y: 60, delay: 1.5 },
    { type: 'Z', x: 5, y: 50, delay: 0.3 },
    { type: 'J', x: 85, y: 30, delay: 0.8 },
    { type: 'L', x: 50, y: 80, delay: 1.2 },
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950">
      {/* Animated Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating Tetris Blocks */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingBlocks.map((block, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              y: [block.y * 10, block.y * 8, block.y * 12],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: block.delay,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: `${block.x}%`,
              top: `${block.y}%`,
            }}
          >
            <TetrisBlockPreview type={block.type} x={0} y={0} size={30} />
          </motion.div>
        ))}
      </div>

      {/* 3D ESUCODES Animation Area */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8"
        >
          {/* 3D Text Effect with Multiple Colors */}
          <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-mono font-bold tracking-tighter">
            <span className="relative inline-block">
              {/* Main Text with Gradient */}
              <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
              
              {/* 3D Shadow Layers with different colors */}
              <span
                className="absolute top-0 left-0 z-0 bg-gradient-to-r from-cyan-600/30 via-purple-600/30 to-orange-600/30 bg-clip-text text-transparent"
                style={{
                  transform: 'translate(4px, 4px)',
                }}
              >
                {displayText}
              </span>
              <span
                className="absolute top-0 left-0 z-0 bg-gradient-to-r from-purple-700/20 via-orange-700/20 to-cyan-700/20 bg-clip-text text-transparent"
                style={{
                  transform: 'translate(8px, 8px)',
                }}
              >
                {displayText}
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl md:text-2xl font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4"
        >
          // GAMES DIVISION
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg font-mono text-slate-400"
        >
          THE ARENA
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center">
          <ChevronDown className="w-6 h-6 text-cyan-400 mb-2" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Scroll
          </span>
        </div>
      </motion.div>
    </section>
  )
}

