import { useState, useEffect } from 'react';
import WebGLBackground from './WebGLBackground';
import { API_URL } from '../config';

export default function Hero() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/profile`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden" id="home">
      <div className="absolute inset-0 w-full h-full opacity-40" style={{ display: 'block' }}>
        <WebGLBackground />
      </div>

      <div className="container max-w-[1200px] mx-auto px-lg relative z-10 text-center">
        <div className="mb-xl flex justify-center">
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden glow-border p-1 bg-surface">
            <img 
              alt={profile?.name || "Rama Fikri Fathan"} 
              className="w-full h-full object-cover rounded-full bg-surface-variant" 
              src={profile?.imageUrl || "/profile.png"}
            />
          </div>
        </div>
        <h1 className="font-display text-display mb-sm text-on-surface hidden md:block">
          Hello, I'm {profile?.name ? profile.name.split(' ')[0] : 'Rama Fikri Fathan'}.
        </h1>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile mb-sm text-on-surface md:hidden">
          Hello, I'm {profile?.name ? profile.name.split(' ')[0] : 'Rama Fikri Fathan'}.
        </h1>
        <p className="font-headline-sm text-headline-sm text-primary mb-xl opacity-90">
          {profile?.title || 'Digital Business Student | Creative Designer'}
        </p>
        
        <div className="flex flex-col md:flex-row gap-md justify-center items-center">
          <a className="px-xl py-md rounded-lg primary-gradient text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20" href="#portfolio">
            View My Work
          </a>
          <a className="px-xl py-md rounded-lg border border-white/20 hover:bg-white/5 transition-all font-semibold active:scale-95" href="#contact">
            Contact Me
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-xl left-1/2 -translate-x-1/2 animate-bounce">
        <span className="material-symbols-outlined text-primary">expand_more</span>
      </div>
    </section>
  )
}
