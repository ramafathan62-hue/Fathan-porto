import { useState, useEffect } from 'react'
import { API_URL } from '../config';

export default function Certifications() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/certifications`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { setCerts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
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
              Loading certifications...
            </div>
          )}
          
          {!loading && (showAll ? certs : (certs.some(c => c.isFeatured) ? certs.filter(c => c.isFeatured) : certs).slice(0, 4)).map((cert) => (
            <div key={cert.id} className="glass-card p-xl rounded-xl flex gap-md items-start group">
              {/* Icon or thumbnail */}
              {cert.fileUrl && !isPdf(cert.fileUrl) ? (
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-lg overflow-hidden shrink-0 block"
                >
                  <img src={cert.fileUrl} alt={cert.title} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                </a>
              ) : (
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-xs gap-2">
                  <h3 className="font-headline-sm text-headline-sm leading-tight">{cert.title}</h3>
                  <span className="text-label-sm text-primary font-bold shrink-0">{cert.year}</span>
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
            <div className="col-span-full text-center py-12 text-on-surface-variant">No certifications added yet.</div>
          )}
        </div>

        {!loading && !showAll && certs.length > 4 && (
          <div className="mt-4xl text-center reveal active">
            <button onClick={() => setShowAll(true)} className="px-xl py-md rounded-full border border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-colors shadow-lg hover:shadow-primary/20">
              View All Certifications
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
