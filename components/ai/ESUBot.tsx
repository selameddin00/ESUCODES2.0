'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Bot } from 'lucide-react'

export default function ESUBot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white border-2 border-white/20 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow group"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot className="w-7 h-7 text-black group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed bottom-6 right-6 w-96 h-[600px] bg-black border-2 border-white/20 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Bot className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-mono font-bold text-lg">ESUBOT</h3>
                    <p className="text-gray-400 font-mono text-xs">AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-12 h-12 text-white/40" />
                  </div>
                  <h2 className="text-3xl font-mono font-bold text-white mb-2">
                    ÇOK YAKINDA
                  </h2>
                  <p className="text-gray-400 font-mono text-sm">
                    ESUBOT yakında hizmetinizde olacak
                  </p>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <p className="text-gray-500 font-mono text-xs text-center">
                  © 2024 ESUCODES AI LAB
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

