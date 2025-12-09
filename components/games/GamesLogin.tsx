'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Zap, Trophy, Sparkles, Star } from 'lucide-react'
import { loginWithWordPress } from '@/actions/wp-auth'

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

export default function GamesLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [systemLogs, setSystemLogs] = useState<string[]>([])
  const [floatingBlocks, setFloatingBlocks] = useState<Array<{ id: number; type: TetrisBlockType; x: number; y: number }>>([])

  // Floating tetris blocks background effect
  useEffect(() => {
    const blockTypes: TetrisBlockType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
    const blocks: Array<{ id: number; type: TetrisBlockType; x: number; y: number }> = []
    
    for (let i = 0; i < 20; i++) {
      blocks.push({
        id: i,
        type: blockTypes[Math.floor(Math.random() * blockTypes.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }
    
    setFloatingBlocks(blocks)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await loginWithWordPress(username, password)

      if (result.success) {
        localStorage.setItem('admin_token', 'wp_admin')
        setTimeout(() => {
          router.push('/games')
        }, 500)
      } else {
        setError(result.error || 'ACCESS DENIED')
        setIsLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError('LOGIN FAILED')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 relative overflow-hidden">
      {/* Floating Tetris Blocks Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {floatingBlocks.map((block) => (
          <motion.div
            key={block.id}
            className="absolute text-5xl font-bold"
            style={{
              left: `${block.x}%`,
              top: `${block.y}%`,
              color: TETRIS_COLORS[block.type],
              textShadow: `0 0 20px ${TETRIS_COLORS[block.type]}`,
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          >
            ■
          </motion.div>
        ))}
      </div>

      {/* Animated Stars */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-2xl -z-10" />

          {/* Main Card */}
          <div className="bg-slate-950/90 backdrop-blur-xl border-2 border-cyan-400/50 rounded-3xl p-8 relative overflow-hidden">
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-purple-400 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-orange-400 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-6"
              >
                <div className="relative inline-block">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-400 to-orange-400 flex items-center justify-center mx-auto"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      boxShadow: [
                        '0 0 20px rgba(6,182,212,0.5)',
                        '0 0 30px rgba(168,85,247,0.5)',
                        '0 0 20px rgba(249,115,22,0.5)',
                        '0 0 20px rgba(6,182,212,0.5)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    <Gamepad2 className="w-10 h-10 text-white" />
                  </motion.div>
                  {/* Sparkles around icon */}
                  {[0, 90, 180, 270].map((angle) => (
                    <motion.div
                      key={angle}
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{
                        rotate: angle,
                      }}
                    >
                      <motion.div
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                          top: '-10px',
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: angle / 360,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-2"
              >
                ARENA LOGIN
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 text-sm"
              >
                Enter the Games Arena
              </motion.p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl text-red-400 text-sm text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-cyan-400 text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Username</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="relative w-full bg-black/50 border-2 border-cyan-400/30 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all placeholder-slate-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-purple-400 text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative w-full bg-black/50 border-2 border-purple-400/30 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all placeholder-slate-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.05, y: -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className="relative w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300 overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                />

                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span className="relative z-10">LOADING...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">PLAY NOW</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Fun Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-slate-700/50 text-center"
            >
              <p className="text-slate-500 text-xs flex items-center justify-center space-x-2">
                <Gamepad2 className="w-3 h-3" />
                <span>Ready to level up?</span>
                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

