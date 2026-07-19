import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary/10 active:scale-90 transition-all duration-300"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {/* Sun icon */}
      <span
        className={`material-symbols-outlined text-[22px] absolute transition-all duration-300 ${
          isDark
            ? 'opacity-0 rotate-90 scale-50'
            : 'opacity-100 rotate-0 scale-100 text-amber-500'
        }`}
      >
        light_mode
      </span>
      {/* Moon icon */}
      <span
        className={`material-symbols-outlined text-[22px] absolute transition-all duration-300 ${
          isDark
            ? 'opacity-100 rotate-0 scale-100 text-primary'
            : 'opacity-0 -rotate-90 scale-50'
        }`}
      >
        dark_mode
      </span>
    </button>
  );
}
