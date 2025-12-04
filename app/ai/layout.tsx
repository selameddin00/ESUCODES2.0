import AIHeader from '@/components/ai/AIHeader'
import AIFooter from '@/components/ai/AIFooter'

export default function AILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AIHeader />
      {children}
      <AIFooter />
    </>
  )
}

