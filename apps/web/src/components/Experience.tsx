import { useState, useEffect } from 'react'
import { API_URL } from '../config'

export default function Experience() {
  const [filter, setFilter] = useState('work')
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/experience`, { cache: 'no-store' })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => setExperiences(Array.isArray(data) ? data : []))
      .catch(err => { console.error('Experience fetch error:', err); setExperiences([]); });
  }, []);

  const filteredExp = experiences.filter(exp => exp.type === filter);

  return (
    <section className="py-4xl" id="experience">
      <div className="container max-w-[1200px] mx-auto px-lg">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-3xl reveal active">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-sm">Experience</h2>
            <p className="text-on-surface-variant">My professional journey and leadership roles.</p>
          </div>
          <div className="flex flex-wrap gap-sm mt-lg md:mt-0">
            <button 
              onClick={() => setFilter('work')}
              className={`portfolio-filter px-md py-sm rounded-lg text-label-md transition-all ${filter === 'work' ? 'bg-primary text-on-primary' : 'border border-on-surface/10 hover:border-primary/50'}`}
            >
              Work & Project
            </button>
            <button 
              onClick={() => setFilter('leadership')}
              className={`portfolio-filter px-md py-sm rounded-lg text-label-md transition-all ${filter === 'leadership' ? 'bg-primary text-on-primary' : 'border border-on-surface/10 hover:border-primary/50'}`}
            >
              Leadership & Organizations
            </button>
          </div>
        </div>

        <div className="reveal active flex flex-col items-center">
          <div className="w-full max-w-4xl transition-all duration-300">
            <div className="space-y-xl mb-4xl w-full">
              {filteredExp.map((exp, i) => (
                <div key={exp.id} className={`relative pl-lg border-l-2 py-sm ${filter === 'work' ? 'border-primary/30' : 'border-secondary/30'}`}>
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${i === 0 ? (filter === 'work' ? 'bg-primary glow-border' : 'bg-secondary glow-border') : (filter === 'work' ? 'bg-primary/30' : 'bg-secondary/30')}`}></div>
                  <span className={`text-label-sm font-label-sm mb-xs block ${filter === 'work' ? 'text-primary' : 'text-secondary'}`}>{exp.period}</span>
                  <h4 className="font-headline-sm text-headline-sm">{exp.title}</h4>
                  <p className={`${filter === 'work' ? 'text-secondary' : 'text-primary'} mb-sm`}>{exp.organization}</p>
                  <p className="text-on-surface-variant text-sm">{exp.description}</p>
                </div>
              ))}
              {experiences.length === 0 && <div className="text-center py-12 text-on-surface-variant">Loading experience...</div>}
            </div>
            
            <div className="mt-2xl flex justify-start">
              <button className="flex items-center gap-md px-xl py-md rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all font-bold group">
                <span className="material-symbols-outlined">download</span>
                Download Full CV
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
