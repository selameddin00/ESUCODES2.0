'use client'

import GamesHeader from '@/components/games/GamesHeader'
import GamesFooter from '@/components/games/GamesFooter'
import { usePathname } from 'next/navigation'

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname?.includes('/games/login')
  const isSnakePage = pathname?.includes('/games/snake')

  if (isLoginPage || isSnakePage) {
    return <>{children}</>
  }

  return (
    <>
      <GamesHeader />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
        {children}
      </main>
      <GamesFooter />
    </>
  )
}

