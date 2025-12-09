'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
]

export default function KonamiCodeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sequence, setSequence] = useState<string[]>([])
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = [...sequence, e.code].slice(-KONAMI_CODE.length)
      setSequence(newSequence)

      if (newSequence.length === KONAMI_CODE.length) {
        const isMatch = newSequence.every(
          (key, index) => key === KONAMI_CODE[index]
        )

        if (isMatch) {
          setIsShaking(true)
          setTimeout(() => {
            // Games sayfasında veya games alt sayfalarındaysak snake sayfasına yönlendir
            if (pathname?.startsWith('/games') && !pathname?.startsWith('/games/snake')) {
              router.push('/games/snake')
            } else {
              // Diğer sayfalarda wormhole'a yönlendir
            router.push('/wormhole')
            }
            setIsShaking(false)
            setSequence([])
          }, 500)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [sequence, router, pathname])

  return (
    <motion.div
      animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

