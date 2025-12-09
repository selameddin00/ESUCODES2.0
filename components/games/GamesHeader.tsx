'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Terminal, Bot, Brain, Home, Gamepad2 } from 'lucide-react'
import { motion } from 'framer-motion'

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

type TetrisBlockType = keyof typeof TETRIS_COLORS

export default function GamesHeader() {
  const [clickCount, setClickCount] = useState(0)
  const [isRocket, setIsRocket] = useState(false)
  const [floatingBlocks, setFloatingBlocks] = useState<Array<{ id: number; type: TetrisBlockType; x: number; y: number }>>([])

  const handleLogoClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount >= 5) {
      setIsRocket(true)
      setTimeout(() => {
        setClickCount(0)
        setIsRocket(false)
      }, 1000)
    }

    setTimeout(() => {
      setClickCount(0)
    }, 2000)
  }

  // Floating tetris blocks background effect
  useEffect(() => {
    const blockTypes: TetrisBlockType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
    const blocks: Array<{ id: number; type: TetrisBlockType; x: number; y: number }> = []
    
    for (let i = 0; i < 8; i++) {
      blocks.push({
        id: i,
        type: blockTypes[Math.floor(Math.random() * blockTypes.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }
    
    setFloatingBlocks(blocks)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 backdrop-blur-xl border-b-2 border-purple-500/30 relative overflow-hidden">
      {/* Animated background blocks */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {floatingBlocks.map((block) => (
          <motion.div
            key={block.id}
            className="absolute"
            style={{
              left: `${block.x}%`,
              top: `${block.y}%`,
              color: TETRIS_COLORS[block.type],
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <div className="text-2xl font-bold">■</div>
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              onClick={handleLogoClick}
              className={`text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent cursor-pointer select-none ${
                isRocket ? 'rocket-launch' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ESUCODES
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {[
              { href: '/', label: 'Anasayfa' },
              { href: '/blog', label: 'Blog' },
              { href: '/team', label: 'Ekip' },
              { href: '/about', label: 'Hakkımızda' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group text-sm text-gray-300 hover:text-white transition-colors duration-300"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Side: Cards + Login */}
          <div className="flex items-center space-x-3">
            {/* Home Card */}
            <Link href="/">
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg font-mono text-xs text-sky-400 hover:border-sky-400 hover:bg-slate-900 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4" />
                <span className="group-hover:hidden">HOME</span>
                <span className="hidden group-hover:inline">MAIN_HUB</span>
              </motion.div>
            </Link>

            {/* Robotics Card */}
            <Link href="/robotics">
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-slate-900/50 border border-orange-500/30 rounded-lg font-mono text-xs text-orange-500 hover:border-orange-500 hover:bg-slate-900 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bot className="w-4 h-4" />
                <span className="group-hover:hidden">ROBOTICS</span>
                <span className="hidden group-hover:inline">THE_HANGAR</span>
              </motion.div>
            </Link>

            {/* AI Card */}
            <Link href="/ai">
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-black/80 border border-white/10 rounded-lg font-mono text-xs text-white hover:border-white/30 hover:bg-black transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-4 h-4" />
                <span className="group-hover:hidden">AI</span>
                <span className="hidden group-hover:inline">THE_CORE</span>
              </motion.div>
            </Link>

            {/* Games Card - Active */}
            <Link href="/games">
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-orange-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-cyan-400 hover:border-purple-400 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:via-purple-500/30 hover:to-orange-500/30 transition-all duration-300 cursor-pointer group shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="group-hover:hidden">GAMES</span>
                <span className="hidden group-hover:inline">THE_ARENA</span>
              </motion.div>
            </Link>

            {/* Login Button */}
            <Link href="/games/login">
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 border border-purple-500/30 rounded-lg font-mono text-sm text-purple-400 hover:border-purple-400 hover:bg-slate-900 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Terminal className="w-4 h-4" />
                <span className="group-hover:hidden">Login</span>
                <span className="hidden group-hover:inline">Access?</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

