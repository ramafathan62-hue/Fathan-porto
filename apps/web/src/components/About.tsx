import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../config'

export default function About() {
  const [profile, setProfile] = useState<any>(null)
  const counterRefs = useRef<(HTMLDivElement | null)[]>([])

  // Fetch profile
  useEffect(() => {
    fetch(`${API_URL}/api/profile`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error('Profile fetch error:', err))
  }, [])

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetEl = entry.target as HTMLDivElement
          const target = +(targetEl.getAttribute('data-target') || 0)
          const speed = 200
          const inc = target / speed

          const updateCount = () => {
            const current = +targetEl.innerText.replace('+', '')
            if (current < target) {
              targetEl.innerText = Math.ceil(current + inc).toString()
              setTimeout(updateCount, 10)
            } else {
              targetEl.innerText = target + '+'
            }
          }
          updateCount()
          observer.unobserve(targetEl)
        }
      })
    }, { threshold: 0.5 })

    counterRefs.current.forEach(counter => {
      if (counter) observer.observe(counter)
    })

    return () => {
      counterRefs.current.forEach(counter => {
        if (counter) observer.unobserve(counter)
      })
    }
  }, [])

  return (
    <section className="py-4xl relative overflow-hidden" id="about">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container max-w-[1200px] mx-auto px-lg relative z-10">
        <div className="flex flex-col lg:flex-row gap-3xl items-center mb-3xl">
          
          <div className="lg:w-1/2 space-y-xl reveal active">
            <h2 className="font-headline-lg text-headline-lg">Bridging Creativity and Business Strategy</h2>
            <p className="text-on-surface-variant font-body-lg leading-relaxed whitespace-pre-line">
              {profile ? profile.bio : "I am currently pursuing a Bachelor's degree in Digital Business at Telkom University Purwokerto (since September 2023). My core interests lie at the intersection of digital marketing, business development, and user experience."}
            </p>
            <div className="flex flex-wrap gap-sm">
              <span className="px-md py-xs bg-primary/10 text-primary rounded-full text-label-sm border border-primary/20">Strategic Planning</span>
              <span className="px-md py-xs bg-primary/10 text-primary rounded-full text-label-sm border border-primary/20">Team Leadership</span>
              <span className="px-md py-xs bg-primary/10 text-primary rounded-full text-label-sm border border-primary/20">Market Analysis</span>
            </div>
          </div>
          
          <div className="lg:w-1/2 glass-card p-xl rounded-xl reveal active">
            <h3 className="font-headline-sm text-headline-sm mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
              Creative & Entrepreneurial Journey
            </h3>
            <p className="text-on-surface-variant mb-lg">
              I channel my entrepreneurial spirit through independent creative projects and freelance collaborations, where I help clients build strong visual identities and effective digital campaigns. Beyond my professional and academic pursuits, I actively contribute to the community by holding strategic leadership roles in the media and research divisions for HIPMI PT Telkom Purwokerto and Dompet Dhuafa Volunteer.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-lg active">
          <div className="glass-card p-lg rounded-xl text-center">
            <div className="text-primary font-display text-headline-lg mb-xs" data-target="3" ref={el => counterRefs.current[0] = el}>0</div>
            <div className="text-on-surface-variant font-label-md uppercase">Years Exp</div>
          </div>
          <div className="glass-card p-lg rounded-xl text-center">
            <div className="text-primary font-display text-headline-lg mb-xs" data-target="10" ref={el => counterRefs.current[1] = el}>0</div>
            <div className="text-on-surface-variant font-label-md uppercase">Pro Projects</div>
          </div>
          <div className="glass-card p-lg rounded-xl text-center">
            <div className="text-primary font-display text-headline-lg mb-xs" data-target="5" ref={el => counterRefs.current[2] = el}>0</div>
            <div className="text-on-surface-variant font-label-md uppercase">Organizations</div>
          </div>
          <div className="glass-card p-lg rounded-xl text-center">
            <div className="text-primary font-display text-headline-lg mb-xs" data-target="15" ref={el => counterRefs.current[3] = el}>0</div>
            <div className="text-on-surface-variant font-label-md uppercase">Certifications</div>
          </div>
        </div>
      </div>
    </section>
  )
}
