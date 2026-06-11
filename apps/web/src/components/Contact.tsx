export default function Contact() {
  return (
    <section className="py-4xl bg-surface-container-high relative overflow-hidden" id="contact">
      {/* Background light effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container max-w-[1200px] mx-auto px-lg relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3xl items-center reveal">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-md">Let's Connect</h2>
            <p className="text-on-surface-variant mb-2xl">Have a project in mind or just want to chat about business and design? Feel free to reach out!</p>
            
            <div className="space-y-lg">
              <div className="flex items-center gap-lg glass-card p-md rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">Email</p>
                  <p className="font-bold">hello@ramafikri.com</p>
                </div>
              </div>
              <div className="flex items-center gap-lg glass-card p-md rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">phone</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">Phone</p>
                  <p className="font-bold">+62 812 3456 7890</p>
                </div>
              </div>
              <div className="flex items-center gap-lg glass-card p-md rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">share</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">LinkedIn</p>
                  <p className="font-bold">linkedin.com/in/ramafikri</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-2xl rounded-2xl">
            <form className="space-y-xl" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input 
                  className="peer w-full bg-transparent border-b-2 border-on-surface/20 py-sm focus:border-primary focus:outline-none transition-all placeholder-transparent" 
                  id="name" 
                  placeholder=" " 
                  type="text"
                />
                <label 
                  className="absolute left-0 top-sm text-on-surface-variant transition-all peer-placeholder-shown:top-sm peer-placeholder-shown:text-body-md peer-focus:-top-md peer-focus:text-label-sm peer-focus:text-primary cursor-text" 
                  htmlFor="name"
                >
                  Full Name
                </label>
              </div>
              <div className="relative">
                <input 
                  className="peer w-full bg-transparent border-b-2 border-on-surface/20 py-sm focus:border-primary focus:outline-none transition-all placeholder-transparent" 
                  id="email" 
                  placeholder=" " 
                  type="email"
                />
                <label 
                  className="absolute left-0 top-sm text-on-surface-variant transition-all peer-placeholder-shown:top-sm peer-placeholder-shown:text-body-md peer-focus:-top-md peer-focus:text-label-sm peer-focus:text-primary cursor-text" 
                  htmlFor="email"
                >
                  Email Address
                </label>
              </div>
              <div className="relative">
                <textarea 
                  className="peer w-full bg-transparent border-b-2 border-on-surface/20 py-sm focus:border-primary focus:outline-none transition-all placeholder-transparent resize-none" 
                  id="message" 
                  placeholder=" " 
                  rows={4}
                />
                <label 
                  className="absolute left-0 top-sm text-on-surface-variant transition-all peer-placeholder-shown:top-sm peer-placeholder-shown:text-body-md peer-focus:-top-md peer-focus:text-label-sm peer-focus:text-primary cursor-text" 
                  htmlFor="message"
                >
                  Project Brief / Message
                </label>
              </div>
              <button 
                className="w-full py-md primary-gradient rounded-lg font-bold text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" 
                type="submit"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
