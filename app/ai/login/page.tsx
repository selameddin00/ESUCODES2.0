'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Zap, Sparkles, Atom, Cpu, Network, Lock } from 'lucide-react'
import { loginWithWordPress } from '@/actions/wp-auth'

export default function AILogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [neuralLayers, setNeuralLayers] = useState<number[]>([])
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Neural network layer visualization
  useEffect(() => {
    const layers = [6, 10, 14, 10, 6]
    setNeuralLayers(layers)
  }, [])

  // Floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setParticles(newParticles)
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
          router.push('/ai')
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-black relative overflow-hidden">
      {/* Neural Network Background Visualization */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {neuralLayers.map((nodeCount, layerIndex) => (
          <div
            key={layerIndex}
            className="absolute top-1/2"
            style={{
              left: `${25 + layerIndex * 15}%`,
              transform: 'translateY(-50%)',
            }}
          >
            {Array.from({ length: nodeCount }).map((_, nodeIndex) => {
              const nodeY = ((nodeIndex / (nodeCount - 1 || 1)) * 2 - 1) * 200
              return (
                <motion.div
                  key={nodeIndex}
                  className="absolute w-3 h-3 bg-white rounded-full"
                  style={{
                    top: `${nodeY + 200}px`,
                    left: '0px',
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                  }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.2, 0.9, 0.2],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Floating Neural Particles */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Matrix Code Rain */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-xs text-white/20"
            style={{
              left: `${(i * 7) % 100}%`,
            }}
            animate={{
              y: ['-10vh', '110vh'],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j} className="whitespace-pre text-green-400/30">
                {Math.random().toString(36).substring(2, 3).toUpperCase()}
              </div>
            ))}
          </motion.div>
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
          <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl -z-10" />

          {/* Main Card */}
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden">
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/50 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/50 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/50 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/50 rounded-br-lg" />

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-6"
              >
                <div className="relative inline-block">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto backdrop-blur-sm"
                    animate={{
                      rotate: [0, 360],
                      boxShadow: [
                        '0 0 20px rgba(255,255,255,0.3)',
                        '0 0 40px rgba(255,255,255,0.5)',
                        '0 0 20px rgba(255,255,255,0.3)',
                      ],
                    }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                      boxShadow: {
                        duration: 3,
                        repeat: Infinity,
                      },
                    }}
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  {/* Orbiting particles */}
                  {[0, 120, 240].map((angle, index) => (
                    <motion.div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 4 + index,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <motion.div
                        className="absolute w-2 h-2 bg-white rounded-full"
                        style={{
                          top: '-20px',
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
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
                className="text-4xl font-bold text-white mb-2"
              >
                NEURAL ACCESS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 text-sm"
              >
                Enter the AI Core
              </motion.p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl text-red-400 text-sm text-center relative z-10"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-white text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Atom className="w-4 h-4" />
                  <span>Username</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="relative w-full bg-black/50 border-2 border-white/20 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all placeholder-white/30"
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
                <label className="block text-white text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative w-full bg-black/50 border-2 border-white/20 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all placeholder-white/30"
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
                className="relative w-full bg-white text-black font-bold py-4 px-6 rounded-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-300 overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                />

                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                    <span className="relative z-10">PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">ACTIVATE</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Fun Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-white/10 text-center relative z-10"
            >
              <p className="text-white/50 text-xs flex items-center justify-center space-x-2">
                <Cpu className="w-3 h-3" />
                <span>Neural network ready</span>
                <Sparkles className="w-3 h-3 text-white animate-pulse" />
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

