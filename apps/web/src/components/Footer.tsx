const LINKEDIN_URL = 'https://www.linkedin.com/in/rama-fikri-fathan-8667b72aa';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full border-t border-on-surface/5 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-lg py-3xl">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-xl mb-2xl">
          <div>
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface mb-sm">Rama Fikri Fathan</div>
            <p className="text-on-surface-variant text-sm max-w-md leading-relaxed">
              Digital Business &amp; Creative Design enthusiast. Crafting meaningful digital experiences through design, strategy, and technology.
            </p>
          </div>
          <div className="flex flex-col gap-md">
            <span className="text-label-md font-bold text-on-surface">Connect</span>
            <div className="flex gap-md">
              <a
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-90"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-90"
                href="mailto:ramafathan62@gmail.com"
                title="Email"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-on-surface/5 mb-lg"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-sm">
          <p className="text-on-surface-variant text-label-sm">
            © {new Date().getFullYear()} Rama Fikri Fathan. All rights reserved.
          </p>
          <p className="text-on-surface-variant/50 text-label-sm">
            Built with passion & creativity
          </p>
        </div>
      </div>
    </footer>
  )
}
