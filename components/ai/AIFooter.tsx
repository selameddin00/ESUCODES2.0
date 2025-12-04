'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AIFooter() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 font-mono text-sm">
              © 2024 ESUCODES. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors font-mono text-sm">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors font-mono text-sm">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

