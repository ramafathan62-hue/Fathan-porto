import ThemeToggle from './ThemeToggle';

export default function TopNavBar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-on-surface/10 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center px-lg py-sm max-w-[1200px] mx-auto">
        <div className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">Rama Fikri Fathan</div>
        <div className="hidden md:flex gap-lg items-center">
          <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#home">Home</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#about">About</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#services">Services</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#portfolio">Portfolio</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#experience">Experience</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#contact">Contact</a>
        </div>
        <div className="flex items-center gap-sm">
          {/* Admin Panel Button */}
          <a
            href={import.meta.env.VITE_ADMIN_URL || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-xs px-md py-xs bg-primary/10 text-primary border border-primary/30 rounded-lg text-label-sm font-bold hover:bg-primary/20 hover:border-primary/60 transition-all active:scale-95"
            title="Open Admin Panel"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            Admin
          </a>
          <ThemeToggle />
          <button className="md:hidden text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
