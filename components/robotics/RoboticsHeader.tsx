'use client'

import Link from 'next/link'
import { Terminal, Bot, Brain, Home, Gamepad2 } from 'lucide-react'
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

            {/* Robotics Card - Active */}
            <Link href="/robotics">
              <motion.div
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-slate-900/80 border-2 border-orange-500 rounded-lg font-mono text-xs text-orange-500 hover:border-orange-400 hover:bg-slate-900 transition-all duration-300 group cursor-pointer shadow-[0_0_15px_rgba(251,146,60,0.3)]"
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

            {/* Robotics Cockpit Login Button */}
            <Link href="/robotics/cockpit/login">
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-[#050505] border-2 border-[#10b981] rounded-lg font-mono text-sm text-[#10b981] hover:bg-[#10b981] hover:text-[#050505] transition-all duration-300 group shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <Terminal className="w-4 h-4" />
                <span className="group-hover:hidden">COCKPIT LOGIN</span>
                <span className="hidden group-hover:inline">ENTER HANGAR</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

