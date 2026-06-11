import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';

function ProjectModal({ project, onClose }: { project: any; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative bg-surface-container rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
        style={{ animation: 'modalIn 0.25s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Image */}
        <div className="relative w-full aspect-video shrink-0 overflow-hidden bg-surface-variant">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container/80 to-transparent" />
          {/* Category badge over image */}
          <span className="absolute bottom-4 left-4 text-label-sm font-bold text-primary bg-primary/20 backdrop-blur-sm border border-primary/30 px-md py-xs rounded-full">
            {project.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-2xl overflow-y-auto">
          <h2 className="font-headline-lg text-headline-lg mb-md">{project.title}</h2>
          <p className="text-on-surface-variant leading-relaxed text-body-lg mb-xl">{project.description}</p>

          {/* Details row */}
          <div className="flex flex-wrap gap-md mb-xl">
            <div className="flex items-center gap-xs bg-surface-variant px-md py-sm rounded-lg">
              <span className="material-symbols-outlined text-primary text-[18px]">category</span>
              <span className="text-label-md font-bold">{project.category}</span>
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-xs bg-primary/10 text-primary border border-primary/30 px-md py-sm rounded-lg font-bold hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                View Project
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/projects?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setProjects(data) : setProjects([]))
      .catch(err => console.error(err));
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section className="py-4xl bg-surface-container-lowest" id="portfolio">
      {/* Project Detail Modal */}
      {selected && <ProjectModal project={selected} onClose={handleClose} />}

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
            <div
              key={project.id}
              className="group cursor-pointer"
              onClick={() => setSelected(project)}
            >
              <div className="relative overflow-hidden rounded-2xl mb-lg aspect-[4/3] bg-surface-variant">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 scale-75 group-hover:scale-100 transition-transform duration-300">
                    <span className="material-symbols-outlined text-2xl">open_in_full</span>
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
  );
}
