import { useState, useEffect } from 'react';
import WebGLBackground from './WebGLBackground';

export default function Hero() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Timestamp busts browser + CDN cache so admin changes reflect immediately
    fetch(`http://localhost:3001/api/profile?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, []);

  // Use last word of name for greeting: "Rama Fikri Fathan" → "Fathan"
  const displayName = profile?.name
    ? profile.name.trim().split(/\s+/).pop()
    : 'Fathan';

  // Build image src — prefix API base if it's a relative /uploads/... path
  const imageSrc = profile?.imageUrl
    ? (profile.imageUrl.startsWith('http')
        ? profile.imageUrl
        : `http://localhost:3001${profile.imageUrl}?t=${Date.now()}`)
    : '/profile.png';

  // Compute dynamic CV Download URL
  let cvDownloadUrl = profile?.cvUrl || '#';
  if (cvDownloadUrl.includes('drive.google.com/file/d/')) {
    const match = cvDownloadUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      cvDownloadUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }

  return (
    <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden" id="home">
      <div className="absolute inset-0 w-full h-full opacity-40" style={{ display: 'block' }}>
        <WebGLBackground />
      </div>

      <div className="container max-w-[1200px] mx-auto px-lg relative z-10 text-center">
        {/* Profile photo */}
        <div className="mb-xl flex justify-center">
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden glow-border p-1 bg-surface">
            <img
              alt={profile?.name || 'Rama Fikri Fathan'}
              className="w-full h-full object-cover rounded-full bg-surface-variant"
              src={imageSrc}
              onError={e => { e.currentTarget.src = '/profile.png'; }}
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-display text-display mb-sm text-on-surface hidden md:block">
          Hello, I'm {displayName}.
        </h1>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile mb-sm text-on-surface md:hidden">
          Hello, I'm {displayName}.
        </h1>

        {/* Subtitle / title */}
        <p className="font-headline-sm text-headline-sm text-primary mb-xl opacity-90">
          {profile?.title || 'Digital Business Student | Creative Designer'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-md justify-center items-center">
          <a
            className="px-xl py-md rounded-lg primary-gradient text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            href="#portfolio"
          >
            View My Work
          </a>
          <a
            className="px-xl py-md rounded-lg border border-white/20 hover:bg-white/5 transition-all font-semibold active:scale-95"
            href="#contact"
          >
            Contact Me
          </a>
          <a
            href={cvDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-xs px-xl py-md rounded-lg border border-primary/50 text-primary hover:bg-primary/10 transition-all font-semibold active:scale-95"
            title="View / Download Full CV"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Download CV
          </a>
        </div>
      </div>

      <div className="absolute bottom-xl left-1/2 -translate-x-1/2 animate-bounce">
        <span className="material-symbols-outlined text-primary">expand_more</span>
      </div>
    </section>
  );
}
