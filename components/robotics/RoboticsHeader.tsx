'use client'

import Link from 'next/link'
import { Terminal, Home, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RoboticsHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-orange-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="text-2xl font-mono font-bold text-orange-500 cursor-pointer select-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ESUCODES
            </motion.div>
          </Link>

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

            {/* Login Button */}
            <Link href="/admin/login">
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg font-mono text-sm text-sky-400 hover:border-sky-400 hover:bg-slate-900 transition-all duration-300 group"
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

