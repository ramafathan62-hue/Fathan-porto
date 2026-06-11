import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../config'

export default function About() {
  const [profile, setProfile] = useState<any>(null)
  const [about, setAbout] = useState<any>(null)
  const [stats, setStats] = useState<any[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const counterRefs = useRef<(HTMLDivElement | null)[]>([])
  const animatedRef = useRef(false)

  // Fetch all data
  useEffect(() => {
    const t = Date.now();
    Promise.all([
      fetch(`${API_URL}/api/profile?t=${t}`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`${API_URL}/api/about?t=${t}`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`${API_URL}/api/stats?t=${t}`, { cache: 'no-store' }).then(r => r.json()),
    ]).then(([profileData, aboutData, statsData]) => {
      setProfile(profileData)
      setAbout(aboutData)
      setSkills(JSON.parse(aboutData.skills || '[]'))
      setStats(Array.isArray(statsData) ? statsData : [])
    }).catch(err => console.error('About fetch error:', err))
  }, [])

  // Counter animation — runs when stats load
  useEffect(() => {
    if (stats.length === 0 || animatedRef.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          counterRefs.current.forEach((el, i) => {
            if (!el) return
            const target = stats[i]?.value ?? 0
            const speed = 200
            const inc = Math.max(target / speed, 0.05)
            let current = 0
            const suffix = stats[i]?.suffix ?? '+'

            const update = () => {
              current += inc
              if (current < target) {
                el.innerText = Math.ceil(current).toString()
                requestAnimationFrame(update)
              } else {
                el.innerText = `${target}${suffix}`
              }
            }
            update()
          })
          observer.disconnect()
        }
      })
    }, { threshold: 0.4 })

    const first = counterRefs.current.find(Boolean)
    if (first) observer.observe(first)
    return () => observer.disconnect()
  }, [stats])

  return (
    <section className="py-4xl relative overflow-hidden" id="about">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container max-w-[1200px] mx-auto px-lg relative z-10">
        <div className="flex flex-col lg:flex-row gap-3xl items-center mb-3xl">
          
          {/* Left: bio + skills */}
          <div className="lg:w-1/2 space-y-xl reveal active">
            <h2 className="font-headline-lg text-headline-lg">
              {about?.headline || 'Bridging Creativity and Business Strategy'}
            </h2>
            <p className="text-on-surface-variant font-body-lg leading-relaxed whitespace-pre-line">
              {profile?.bio || "I am currently pursuing a Bachelor's degree in Digital Business at Telkom University Purwokerto."}
            </p>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-sm">
                {skills.map((skill, i) => (
                  <span key={i} className="px-md py-xs bg-primary/10 text-primary rounded-full text-label-sm border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Right: journey card */}
          <div className="lg:w-1/2 glass-card p-xl rounded-xl reveal active">
            <h3 className="font-headline-sm text-headline-sm mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
              {about?.journeyTitle || 'Creative & Entrepreneurial Journey'}
            </h3>
            <p className="text-on-surface-variant">
              {about?.journeyText || 'I channel my entrepreneurial spirit through independent creative projects and freelance collaborations...'}
            </p>
          </div>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className={`reveal grid gap-lg active ${
            stats.length <= 2 ? 'grid-cols-2' :
            stats.length === 3 ? 'grid-cols-3' :
            'grid-cols-2 md:grid-cols-4'
          }`}>
            {stats.map((stat, i) => (
              <div key={stat.id} className="glass-card p-lg rounded-xl text-center">
                <div
                  className="text-primary font-display text-headline-lg mb-xs"
                  ref={el => counterRefs.current[i] = el}
                >
                  0
                </div>
                <div className="text-on-surface-variant font-label-md uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
