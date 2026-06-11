export default function Footer() {
  return (
    <footer className="bg-surface dark:bg-surface w-full py-xl border-t border-on-surface/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-lg max-w-[1200px] mx-auto gap-md">
        <div className="font-headline-sm text-headline-sm font-bold text-on-surface">Rama Fikri Fathan</div>
        <p className="text-on-surface-variant font-label-sm text-label-sm">© {new Date().getFullYear()} Rama Fikri Fathan. All rights reserved.</p>
        <div className="flex gap-lg">
          <a className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">LinkedIn</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">GitHub</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Twitter</a>
        </div>
      </div>
    </footer>
  )
}
