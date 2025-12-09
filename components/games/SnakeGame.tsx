'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT')
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(INITIAL_SPEED)

  // Generate random food position
  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  }, [])

  // Check collision
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    // Self collision
    return body.some((segment) => segment.x === head.x && segment.y === head.y)
  }, [])

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return

    const gameInterval = setInterval(() => {
      setDirection(nextDirection)

      setSnake((prevSnake) => {
        const head = prevSnake[0]
        const newHead: Position = { ...head }

        switch (nextDirection) {
          case 'UP':
            newHead.y -= 1
            break
          case 'DOWN':
            newHead.y += 1
            break
          case 'LEFT':
            newHead.x -= 1
            break
          case 'RIGHT':
            newHead.x += 1
            break
        }

        // Check collision
        if (checkCollision(newHead, prevSnake)) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood())
          setScore((prev) => prev + 10)
          setSpeed((prev) => Math.max(80, prev - 2))
          return newSnake
        } else {
          // Remove tail if food not eaten
          newSnake.pop()
          return newSnake
        }
      })
    }, speed)

    return () => clearInterval(gameInterval)
  }, [nextDirection, food, gameOver, isPaused, speed, checkCollision, generateFood])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (direction !== 'DOWN') setNextDirection('UP')
          break
        case 'ArrowDown':
          e.preventDefault()
          if (direction !== 'UP') setNextDirection('DOWN')
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (direction !== 'RIGHT') setNextDirection('LEFT')
          break
        case 'ArrowRight':
          e.preventDefault()
          if (direction !== 'LEFT') setNextDirection('RIGHT')
          break
        case ' ':
          e.preventDefault()
          setIsPaused((prev) => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, gameOver])

  // Reset game
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection('RIGHT')
    setNextDirection('RIGHT')
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
    setSpeed(INITIAL_SPEED)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
      {/* Game Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Score & Controls */}
        <div className="flex items-center justify-between mb-4 glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-slate-500 text-xs font-mono">SCORE</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono">{score}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-mono">SPEED</p>
              <p className="text-lg font-bold text-purple-400 font-mono">
                {Math.round((INITIAL_SPEED - speed) / 2)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="glass rounded-lg p-2 hover:bg-slate-900 transition-colors border border-slate-700"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-cyan-400" />
              ) : (
                <Pause className="w-5 h-5 text-cyan-400" />
              )}
            </button>
            <button
              onClick={resetGame}
              className="glass rounded-lg p-2 hover:bg-slate-900 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div
          className="relative border-4 border-cyan-400/50 rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden"
          style={{
            width: `${GRID_SIZE * CELL_SIZE}px`,
            height: `${GRID_SIZE * CELL_SIZE}px`,
          }}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            }}
          />

          {/* Food */}
          <div
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"
            style={{
              left: `${food.x * CELL_SIZE}px`,
              top: `${food.y * CELL_SIZE}px`,
              width: `${CELL_SIZE - 2}px`,
              height: `${CELL_SIZE - 2}px`,
              boxShadow: `0 0 10px #06b6d4, 0 0 20px #a855f7`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute rounded ${
                index === 0 ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' : 'bg-gradient-to-r from-purple-400 to-orange-400'
              }`}
              style={{
                left: `${segment.x * CELL_SIZE}px`,
                top: `${segment.y * CELL_SIZE}px`,
                width: `${CELL_SIZE - 2}px`,
                height: `${CELL_SIZE - 2}px`,
                boxShadow: index === 0 
                  ? `0 0 10px #06b6d4, 0 0 20px #06b6d4` 
                  : `0 0 5px #a855f7`,
                zIndex: snake.length - index,
              }}
            />
          ))}

          {/* Game Over Overlay */}
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
            >
              <motion.h2
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 font-mono"
              >
                GAME OVER
              </motion.h2>
              <p className="text-slate-400 mb-6 font-mono">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="glass rounded-lg px-6 py-3 hover:bg-slate-900 transition-colors font-mono text-cyan-400 border border-cyan-400/30 hover:border-cyan-400"
              >
                YENİDEN BAŞLA
              </button>
            </motion.div>
          )}

          {/* Pause Overlay */}
          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
            >
              <motion.h2
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold text-cyan-400 font-mono"
              >
                DURAKLADI
              </motion.h2>
            </motion.div>
          )}

          {/* Corner Decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
        </div>

        {/* Instructions */}
        <div className="mt-6 glass rounded-lg p-4 max-w-md border border-slate-700">
          <p className="text-slate-500 text-xs font-mono text-center mb-2">
            [KONTROLLER]
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span>↑↓←→</span>
            <span>•</span>
            <span>SPACE: Duraklat</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

