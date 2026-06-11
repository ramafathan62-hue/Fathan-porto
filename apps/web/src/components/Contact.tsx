import { useState } from 'react'
import { API_URL } from '../config';

const LINKEDIN_URL = 'https://www.linkedin.com/in/rama-fikri-fathan-8667b72aa';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Could not connect to server. Please try again.');
    }
  };

  const inputClass = 'peer w-full bg-transparent border-b-2 border-on-surface/20 py-sm focus:border-primary focus:outline-none transition-all placeholder-transparent';
  const labelClass = 'absolute left-0 top-sm text-on-surface-variant transition-all peer-placeholder-shown:top-sm peer-placeholder-shown:text-body-md peer-focus:-top-md peer-focus:text-label-sm peer-focus:text-primary cursor-text';

  return (
    <section className="py-4xl bg-surface-container-high relative overflow-hidden" id="contact">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container max-w-[1200px] mx-auto px-lg relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3xl items-center reveal">
          {/* Contact Info */}
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-md">Let's Connect</h2>
            <p className="text-on-surface-variant mb-2xl">Have a project in mind or just want to chat about business and design? Feel free to reach out!</p>
            
            <div className="space-y-lg">
              <a href="mailto:ramafathan62@gmail.com" className="flex items-center gap-lg glass-card p-md rounded-lg hover:border-primary/40 transition-colors group">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">Email</p>
                  <p className="font-bold">ramafathan62@gmail.com</p>
                </div>
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-lg glass-card p-md rounded-lg hover:border-primary/40 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">LinkedIn</p>
                  <p className="font-bold">linkedin.com/in/rama-fikri-fathan</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] ml-auto">arrow_outward</span>
              </a>

              <div className="flex items-center gap-lg glass-card p-md rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">Location</p>
                  <p className="font-bold">Purwokerto, Jawa Tengah</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="glass-card p-2xl rounded-2xl">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-400 text-4xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent! 🎉</h3>
                <p className="text-on-surface-variant mb-6">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-xl py-sm border border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form className="space-y-xl" onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold mb-2">Send a Message</h3>

                <div className="relative">
                  <input
                    className={inputClass}
                    id="name"
                    name="name"
                    placeholder=" "
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                  <label className={labelClass} htmlFor="name">Full Name</label>
                </div>

                <div className="relative">
                  <input
                    className={inputClass}
                    id="email"
                    name="email"
                    placeholder=" "
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                  <label className={labelClass} htmlFor="email">Email Address</label>
                </div>

                <div className="relative">
                  <textarea
                    className={inputClass + ' resize-none'}
                    id="message"
                    name="message"
                    placeholder=" "
                    rows={4}
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                  <label className={labelClass} htmlFor="message">Project Brief / Message</label>
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {errorMsg}
                  </p>
                )}

                <button
                  className="w-full py-md primary-gradient rounded-lg font-bold text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
                  type="submit"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
