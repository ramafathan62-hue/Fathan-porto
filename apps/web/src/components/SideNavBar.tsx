export default function SideNavBar() {
  return (
    <div className="fixed bottom-lg right-lg z-50 flex items-center justify-center">
      <div className="group relative">
        <button className="bg-primary dark:bg-primary text-on-primary dark:text-on-primary rounded-full p-lg shadow-2xl shadow-primary/30 hover:scale-110 transition-transform duration-200 active:scale-90 flex">
          <span className="material-symbols-outlined">chat</span>
        </button>
        <div className="absolute bottom-[100%] right-0 mb-md w-64 glass-card p-lg rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none group-hover:pointer-events-auto">
          <h4 className="font-headline-sm text-headline-sm mb-xs">WhatsApp</h4>
          <p className="text-label-md font-label-md mb-md opacity-80">Connect with me</p>
          <a className="block w-full py-sm bg-white/20 text-center rounded-full font-label-md text-label-md hover:bg-white/30 transition-colors" href="#">Message Now</a>
        </div>
      </div>
    </div>
  )
}
