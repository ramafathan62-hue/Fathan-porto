import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Portfolio() {
  const [filter, setFilter] = useState('All')
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`, { cache: 'no-store' })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(err => { console.error('Projects fetch error:', err); setProjects([]); });
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.category === filter)

  return (
    <section className="py-4xl bg-surface-container-lowest" id="portfolio">
      <div className="container max-w-[1200px] mx-auto px-lg">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-3xl reveal active">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-sm">Selected Works</h2>
            <p className="text-on-surface-variant">A showcase of my recent projects and collaborations.</p>
          </div>
          <div className="flex flex-wrap gap-sm mt-lg md:mt-0">
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setFilter(category)}
                className={`portfolio-filter px-md py-sm rounded-lg text-label-md transition-all ${filter === category ? 'bg-primary text-on-primary' : 'border border-on-surface/10 hover:border-primary/50'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2xl reveal active">
          {filteredProjects.map(project => (
            <div key={project.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-lg aspect-[4/3] bg-surface-variant">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                    <span className="material-symbols-outlined">arrow_outward</span>
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline-sm text-headline-sm mb-xs group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2">{project.description}</p>
                </div>
                <span className="text-label-sm font-label-sm text-primary bg-primary/10 px-sm py-xs rounded-md whitespace-nowrap ml-md">
                  {project.category}
                </span>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
             <div className="col-span-full text-center py-12 text-on-surface-variant">Loading projects...</div>
          )}
        </div>

        <div className="mt-4xl text-center reveal active">
          <button className="px-xl py-md rounded-full border border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-colors shadow-lg hover:shadow-primary/20">
            View All Projects
          </button>
        </div>

      </div>
    </section>
  )
}
