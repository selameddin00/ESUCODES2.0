'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Terminal, Bot, Brain, Home, Gamepad2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AIHeader() {
  const [clickCount, setClickCount] = useState(0)
  const [isRocket, setIsRocket] = useState(false)

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

  const navLinks = [
    { href: '/', label: 'Anasayfa' },
    { href: '/blog', label: 'Blog' },
    { href: '/team', label: 'Ekip' },
    { href: '/about', label: 'Hakkımızda' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              onClick={handleLogoClick}
              className={`text-2xl font-bold text-white cursor-pointer select-none ${
                isRocket ? 'rocket-launch' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ESUCODES
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group text-gray-400 hover:text-white transition-colors duration-300"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Side: Cards + Login */}
          <div className="flex items-center space-x-3">
            {/* Home Card */}
            <Link href="/">
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
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
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bot className="w-4 h-4" />
                <span className="group-hover:hidden">ROBOTICS</span>
                <span className="hidden group-hover:inline">THE_HANGAR</span>
              </motion.div>
            </Link>

            {/* AI Card - Active */}
            <Link href="/ai">
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-white border border-white rounded-lg font-mono text-xs text-black hover:bg-white/90 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-4 h-4" />
                <span>AI</span>
              </motion.div>
            </Link>

            {/* Games Card */}
            <Link href="/games">
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-orange-500/20 border border-cyan-400/30 rounded-lg font-mono text-xs text-cyan-400 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:via-purple-500/30 hover:to-orange-500/30 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="group-hover:hidden">GAMES</span>
                <span className="hidden group-hover:inline">THE_ARENA</span>
              </motion.div>
            </Link>

            {/* Login Button */}
            <Link href="/admin/login">
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 group"
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

