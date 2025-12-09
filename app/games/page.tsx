import GamesHomeHero from '@/components/games/GamesHomeHero'
import GamesLibrary from '@/components/games/GamesLibrary'

export default function GamesPage() {
  return (
    <>
      <GamesHomeHero />
      <div className="container mx-auto px-4">
        <GamesLibrary />
      </div>
    </>
  )
}

