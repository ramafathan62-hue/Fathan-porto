import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Certifications() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/certifications`, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Guard: ensure we always set an array
        setCerts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Certifications fetch error:', err);
        setCerts([]);
        setLoading(false);
      });
  }, []);

  const isPdf = (url: string) => /\.pdf$/i.test(url);

  return (
    <section className="py-4xl bg-surface-container-low" id="certifications">
      <div className="container max-w-[1200px] mx-auto px-lg">
        <div className="text-center mb-3xl reveal active">
          <h2 className="font-headline-lg text-headline-lg mb-md">Certifications</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Continuous learning and professional skill validations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg reveal active">
          {loading && (
            <div className="col-span-full text-center py-12 text-on-surface-variant">
              <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>Loading certifications...</p>
            </div>
          )}
          {!loading && certs.map((cert) => (
            <div key={cert.id} className="glass-card p-xl rounded-xl flex gap-md items-start group hover:scale-[1.01] transition-transform">
              {/* Icon or thumbnail */}
              {cert.fileUrl && !isPdf(cert.fileUrl) ? (
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-xl overflow-hidden shrink-0 block border border-primary/20"
                >
                  <img src={cert.fileUrl} alt={cert.title} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                </a>
              ) : cert.fileUrl && isPdf(cert.fileUrl) ? (
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-xl shrink-0 flex flex-col items-center justify-center bg-red-500/10 border border-red-400/20 hover:bg-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-red-400 text-2xl">picture_as_pdf</span>
                  <span className="text-[10px] text-red-400 font-bold">PDF</span>
                </a>
              ) : (
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-xs gap-2">
                  <h3 className="font-headline-sm text-headline-sm leading-tight">{cert.title}</h3>
                  <span className="text-label-sm text-primary font-bold shrink-0 bg-primary/10 px-2 py-0.5 rounded-md">{cert.year}</span>
                </div>
                <p className="text-secondary font-semibold text-sm mb-sm">{cert.organization}</p>
                <p className="text-on-surface-variant text-sm mb-md">{cert.description}</p>

                {/* View Certificate Button */}
                {cert.fileUrl && (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-xs text-sm font-bold text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 px-md py-xs rounded-lg transition-all hover:bg-primary/5"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isPdf(cert.fileUrl) ? 'picture_as_pdf' : 'visibility'}
                    </span>
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
          {!loading && certs.length === 0 && (
            <div className="col-span-full text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl block mb-3 opacity-30">workspace_premium</span>
              No certifications added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
