'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import { teamMembers } from '@/lib/teamData'

export default function TeamGrid() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent">
          Ekip
        </h1>
        <p className="text-text-secondary text-lg">
          Yazılım evrenini şekillendiren ekip
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group"
          >
            <Link href={`/team/${member.slug}`}>
              <div
                className={`glass rounded-2xl p-6 h-full flex flex-col hover:bg-bg-tertiary transition-all duration-300 ${
                  member.effect === 'glitch' ? 'glitch-effect' : ''
                }`}
                data-text={member.name}
              >
                {/* Avatar */}
                <div className="relative mb-4">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-xl mx-auto object-cover border border-white/10 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl mx-auto bg-gradient-to-r from-accent-primary to-accent-tertiary flex items-center justify-center text-3xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  {member.effect === 'matrix' && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-xs font-mono text-accent-tertiary text-center">
                        01001001
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-center mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-accent-primary text-center text-sm font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-text-secondary text-sm text-center mb-4 flex-grow">
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {member.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-accent-primary/20 text-accent-primary rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social */}
                <div className="flex justify-center space-x-4 pt-4 border-t border-white/10">
                  <Github className="w-5 h-5 text-text-muted hover:text-accent-primary transition-colors" />
                  <Linkedin className="w-5 h-5 text-text-muted hover:text-accent-primary transition-colors" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

