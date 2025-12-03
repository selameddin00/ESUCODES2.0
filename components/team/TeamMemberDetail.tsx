'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Twitter, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { getTeamMemberBySlug, TeamMember } from '@/lib/teamData'

export default function TeamMemberDetail({ slug }: { slug: string }) {
  const [member, setMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    const foundMember = getTeamMemberBySlug(slug)
    if (foundMember) {
      setMember(foundMember)
    }
  }, [slug])

  // Body özelleştirmelerini uygula
  useEffect(() => {
    if (member?.customization) {
      const body = document.body
      const originalStyle = {
        backgroundColor: body.style.backgroundColor,
        backgroundImage: body.style.backgroundImage,
        backgroundPosition: body.style.backgroundPosition,
        backgroundSize: body.style.backgroundSize,
      }

      if (member.customization.backgroundColor) {
        body.style.backgroundColor = member.customization.backgroundColor
      }

      if (member.customization.backgroundImage) {
        const bgImage = `url(${member.customization.backgroundImage})`
        const overlay = member.customization.backgroundOverlay || 'rgba(0, 0, 0, 0.5)'
        body.style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), ${bgImage}`
        body.style.backgroundPosition = member.customization.backgroundPosition || 'center'
        body.style.backgroundSize = member.customization.backgroundSize || 'cover'
        body.style.backgroundRepeat = 'no-repeat'
        body.style.backgroundAttachment = 'fixed'
      }

      // Cleanup function
      return () => {
        body.style.backgroundColor = originalStyle.backgroundColor
        body.style.backgroundImage = originalStyle.backgroundImage
        body.style.backgroundPosition = originalStyle.backgroundPosition
        body.style.backgroundSize = originalStyle.backgroundSize
        body.style.backgroundRepeat = ''
        body.style.backgroundAttachment = ''
      }
    }
  }, [member])

  if (!member) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Link
          href="/team"
          className="inline-flex items-center text-accent-primary hover:text-accent-tertiary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ekibe Dön
        </Link>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Üye bulunamadı
          </h1>
          <p className="text-text-secondary">
            Aradığınız ekip üyesi bulunamadı.
          </p>
        </div>
      </div>
    )
  }

  const radarData = member.skillsDetailed
    ? Object.entries(member.skillsDetailed).map(([skill, value]) => ({
        skill,
        value,
        fullMark: 100,
      }))
    : []

  return (
    <div className="container mx-auto px-4 py-20">
      <Link
        href="/team"
        className="inline-flex items-center text-accent-primary hover:text-accent-tertiary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Ekibe Dön
      </Link>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-r from-accent-primary to-accent-tertiary text-5xl font-bold">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{member.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent">
                {member.name}
              </h1>
              <p className="text-xl text-accent-primary mb-4">{member.role}</p>
              <p className="text-text-secondary mb-6">{member.bio}</p>
              {member.social && (
                <div className="flex justify-center md:justify-start space-x-4">
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent-primary transition-colors"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent-primary transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent-primary transition-colors"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-text-primary">
              Yetenekler
            </h2>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Radar
                    name="Yetenekler"
                    dataKey="value"
                    stroke="#818cf8"
                    fill="#818cf8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center py-8">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-accent-primary/20 text-accent-primary rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-text-primary">
              Projeler
            </h2>
            {member.projects && member.projects.length > 0 ? (
              <div className="space-y-4">
                {member.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-4 bg-bg-secondary rounded-xl border border-white/10"
                  >
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {project.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">
                Henüz proje bilgisi eklenmemiş.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

